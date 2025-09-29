from flask import Flask, request, jsonify
import redis
import json
import subprocess
import tempfile
import os
import sys
from datetime import datetime
import traceback

app = Flask(__name__)

# Redis connection
redis_client = redis.Redis(host='redis', port=6379, db=0, decode_responses=True)

class MLEvaluator:
    def __init__(self):
        self.supported_libraries = [
            'pandas', 'numpy', 'sklearn', 'matplotlib', 'seaborn', 
            'plotly', 'scipy', 'xgboost', 'lightgbm', 'tensorflow', 'torch'
        ]
    
    def evaluate_code(self, code, test_cases, expected_output):
        """Evaluate Python ML code"""
        try:
            # Create a temporary file for the code
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            # Run the code and capture output
            result = subprocess.run(
                [sys.executable, temp_file],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            # Clean up
            os.unlink(temp_file)
            
            if result.returncode != 0:
                return {
                    'success': False,
                    'error': result.stderr,
                    'score': 0
                }
            
            # Evaluate the output
            score = self._calculate_score(result.stdout, expected_output, code)
            
            return {
                'success': True,
                'output': result.stdout,
                'score': score,
                'code_quality': self._evaluate_code_quality(code),
                'ml_knowledge': self._evaluate_ml_knowledge(code),
                'problem_solving': self._evaluate_problem_solving(code),
                'engineering': self._evaluate_engineering(code)
            }
            
        except subprocess.TimeoutExpired:
            return {
                'success': False,
                'error': 'Code execution timed out',
                'score': 0
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'score': 0
            }
    
    def _calculate_score(self, output, expected_output, code):
        """Calculate score based on output correctness"""
        # Basic scoring logic - can be enhanced
        if not expected_output:
            return 50  # Default score if no expected output
        
        # Simple string comparison for now
        if expected_output.strip() in output.strip():
            return 100
        elif any(line.strip() in output.strip() for line in expected_output.split('\n')):
            return 75
        else:
            return 25
    
    def _evaluate_code_quality(self, code):
        """Evaluate code quality aspects"""
        score = 0
        
        # Check for proper imports
        if 'import' in code or 'from' in code:
            score += 20
        
        # Check for functions/classes
        if 'def ' in code or 'class ' in code:
            score += 20
        
        # Check for comments
        if '#' in code or '"""' in code or "'''" in code:
            score += 15
        
        # Check for error handling
        if 'try:' in code or 'except' in code:
            score += 15
        
        # Check for variable naming (basic)
        lines = code.split('\n')
        good_names = sum(1 for line in lines if any(word in line for word in ['data', 'model', 'result', 'score', 'accuracy']))
        if good_names > 0:
            score += 15
        
        # Check for proper structure
        if len(code.split('\n')) > 5:
            score += 15
        
        return min(score, 100)
    
    def _evaluate_ml_knowledge(self, code):
        """Evaluate ML knowledge"""
        score = 0
        
        # Check for ML libraries
        ml_libs = ['sklearn', 'pandas', 'numpy', 'tensorflow', 'torch', 'xgboost']
        used_libs = [lib for lib in ml_libs if lib in code.lower()]
        score += min(len(used_libs) * 20, 60)
        
        # Check for ML concepts
        ml_concepts = ['train', 'test', 'fit', 'predict', 'score', 'accuracy', 'precision', 'recall', 'f1']
        concepts_found = sum(1 for concept in ml_concepts if concept in code.lower())
        score += min(concepts_found * 5, 40)
        
        return min(score, 100)
    
    def _evaluate_problem_solving(self, code):
        """Evaluate problem-solving approach"""
        score = 0
        
        # Check for data preprocessing
        if any(word in code.lower() for word in ['clean', 'preprocess', 'transform', 'scale', 'normalize']):
            score += 25
        
        # Check for model selection
        if any(word in code.lower() for word in ['model', 'algorithm', 'classifier', 'regressor']):
            score += 25
        
        # Check for evaluation
        if any(word in code.lower() for word in ['evaluate', 'score', 'metric', 'cross_val']):
            score += 25
        
        # Check for optimization
        if any(word in code.lower() for word in ['optimize', 'tune', 'grid', 'random']):
            score += 25
        
        return min(score, 100)
    
    def _evaluate_engineering(self, code):
        """Evaluate engineering practices"""
        score = 0
        
        # Check for modularity
        if 'def ' in code:
            score += 30
        
        # Check for configuration
        if any(word in code.lower() for word in ['config', 'parameter', 'setting']):
            score += 20
        
        # Check for logging/monitoring
        if any(word in code.lower() for word in ['print', 'log', 'monitor']):
            score += 15
        
        # Check for documentation
        if '"""' in code or "'''" in code:
            score += 20
        
        # Check for error handling
        if 'try:' in code or 'except' in code:
            score += 15
        
        return min(score, 100)

evaluator = MLEvaluator()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/evaluate', methods=['POST'])
def evaluate_challenge():
    try:
        data = request.get_json()
        
        if not data or 'code' not in data:
            return jsonify({'error': 'Code is required'}), 400
        
        code = data['code']
        test_cases = data.get('test_cases', '')
        expected_output = data.get('expected_output', '')
        
        # Evaluate the code
        result = evaluator.evaluate_code(code, test_cases, expected_output)
        
        # Store result in Redis
        evaluation_id = f"eval_{datetime.now().timestamp()}"
        redis_client.setex(
            f"evaluation:{evaluation_id}",
            3600,  # 1 hour TTL
            json.dumps(result)
        )
        
        return jsonify({
            'evaluation_id': evaluation_id,
            'result': result
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/evaluation/<evaluation_id>', methods=['GET'])
def get_evaluation(evaluation_id):
    try:
        result = redis_client.get(f"evaluation:{evaluation_id}")
        
        if not result:
            return jsonify({'error': 'Evaluation not found'}), 404
        
        return jsonify(json.loads(result))
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)



# Clear existing data
Candidate.destroy_all
Challenge.destroy_all
ChallengeAttempt.destroy_all

puts "Creating sample candidates..."

# Create sample candidates
candidates = [
  {
    email: "demo@example.com",
    password: "password123",
    first_name: "John",
    last_name: "Doe",
    phone: "+1-555-0123",
    bio: "Experienced ML engineer with 5+ years in the field. Passionate about deep learning and MLOps.",
    linkedin_url: "https://linkedin.com/in/johndoe",
    github_url: "https://github.com/johndoe",
    portfolio_url: "https://johndoe.dev",
    experience_level: "senior"
  },
  {
    email: "jane.smith@example.com",
    password: "password123",
    first_name: "Jane",
    last_name: "Smith",
    phone: "+1-555-0124",
    bio: "Data scientist transitioning to ML engineering. Strong background in statistics and Python.",
    linkedin_url: "https://linkedin.com/in/janesmith",
    github_url: "https://github.com/janesmith",
    experience_level: "mid"
  },
  {
    email: "alex.chen@example.com",
    password: "password123",
    first_name: "Alex",
    last_name: "Chen",
    bio: "Recent CS graduate with focus on machine learning. Eager to learn and grow in ML engineering.",
    github_url: "https://github.com/alexchen",
    experience_level: "junior"
  }
]

candidates.each do |candidate_data|
  candidate = Candidate.create!(candidate_data)
  puts "Created candidate: #{candidate.full_name} (#{candidate.candidate_id})"
end

puts "\nCreating sample challenges..."

# Create sample challenges
challenges = [
  {
    title: "Data Preprocessing for Customer Segmentation",
    description: "Clean and preprocess customer data for a segmentation model. Handle missing values, outliers, and feature engineering.",
    instructions: "You are given a dataset with customer information including demographics, purchase history, and behavior data. Your task is to:

1. Load and explore the dataset
2. Handle missing values appropriately
3. Detect and handle outliers
4. Perform feature engineering
5. Scale/normalize features as needed
6. Split the data into train/test sets

The dataset contains the following columns:
- customer_id: Unique identifier
- age: Customer age (some missing values)
- income: Annual income (some outliers)
- purchase_frequency: Number of purchases per month
- avg_order_value: Average order value
- last_purchase_days: Days since last purchase
- is_premium: Premium customer flag

Write clean, well-documented code that demonstrates best practices in data preprocessing.",
    starter_code: "import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Load the dataset
# data = pd.read_csv('customer_data.csv')

# Your preprocessing code here
",
    test_cases: "Test that the data is properly cleaned and preprocessed",
    expected_output: "Preprocessed dataset with no missing values, handled outliers, and scaled features",
    difficulty: "easy",
    category: "data_preprocessing",
    max_score: 100,
    time_limit: 45,
    status: "active",
    tags: ["pandas", "data-cleaning", "feature-engineering"],
    evaluation_criteria: {
      "code_quality": 25,
      "ml_knowledge": 25,
      "problem_solving": 25,
      "engineering": 25
    }
  },
  {
    title: "Build a Classification Model for Email Spam Detection",
    description: "Create a machine learning model to classify emails as spam or not spam using text features.",
    instructions: "You need to build a spam detection classifier. The dataset contains email text and labels.

Your task:
1. Load and explore the email dataset
2. Perform text preprocessing (tokenization, cleaning, etc.)
3. Extract features from text (TF-IDF, word counts, etc.)
4. Train a classification model
5. Evaluate the model performance
6. Make predictions on test data

Consider using techniques like:
- Text preprocessing and cleaning
- Feature extraction (TF-IDF, bag of words)
- Model selection (Logistic Regression, Naive Bayes, SVM)
- Cross-validation for robust evaluation
- Performance metrics (accuracy, precision, recall, F1-score)

Write production-ready code with proper error handling and documentation.",
    starter_code: "import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix

# Load the dataset
# emails = pd.read_csv('emails.csv')

# Your model building code here
",
    test_cases: "Test model accuracy and performance metrics",
    expected_output: "Trained model with >90% accuracy and detailed performance metrics",
    difficulty: "medium",
    category: "model_training",
    max_score: 100,
    time_limit: 60,
    status: "active",
    tags: ["text-classification", "nlp", "sklearn"],
    evaluation_criteria: {
      "code_quality": 20,
      "ml_knowledge": 30,
      "problem_solving": 30,
      "engineering": 20
    }
  },
  {
    title: "Model Evaluation and Interpretability Analysis",
    description: "Evaluate a pre-trained model's performance and provide insights into its decision-making process.",
    instructions: "You are given a pre-trained model and test dataset. Your task is to:

1. Load the model and test data
2. Generate predictions on the test set
3. Calculate comprehensive performance metrics
4. Analyze model behavior and interpretability
5. Identify potential biases or issues
6. Provide actionable insights

Focus on:
- Multiple evaluation metrics (accuracy, precision, recall, F1, AUC-ROC)
- Confusion matrix analysis
- Feature importance analysis
- Model interpretability techniques (SHAP, LIME, or feature importance)
- Bias detection and fairness analysis
- Visualization of results

The model is a binary classifier, and you should provide a comprehensive evaluation report.",
    starter_code: "import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.inspection import permutation_importance

# Load the pre-trained model and test data
# model = joblib.load('trained_model.pkl')
# X_test, y_test = load_test_data()

# Your evaluation code here
",
    test_cases: "Comprehensive model evaluation with interpretability analysis",
    expected_output: "Detailed evaluation report with metrics, visualizations, and insights",
    difficulty: "medium",
    category: "model_evaluation",
    max_score: 100,
    time_limit: 50,
    status: "active",
    tags: ["model-evaluation", "interpretability", "bias-detection"],
    evaluation_criteria: {
      "code_quality": 20,
      "ml_knowledge": 35,
      "problem_solving": 25,
      "engineering": 20
    }
  },
  {
    title: "MLOps Pipeline: Model Deployment and Monitoring",
    description: "Design and implement an MLOps pipeline for model deployment with monitoring and retraining capabilities.",
    instructions: "You need to create an MLOps pipeline for deploying a machine learning model. Your task includes:

1. Model serialization and versioning
2. API endpoint creation for model serving
3. Input validation and preprocessing
4. Model monitoring and logging
5. Performance tracking and alerting
6. Automated retraining pipeline

Implement:
- REST API for model inference
- Input validation and error handling
- Logging and monitoring setup
- Model performance tracking
- Automated retraining triggers
- Containerization (Docker)
- CI/CD pipeline considerations

Focus on production-ready code with proper error handling, logging, and monitoring.",
    starter_code: "from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import logging
from datetime import datetime

app = Flask(__name__)

# Your MLOps pipeline code here
",
    test_cases: "Test API endpoints, monitoring, and retraining pipeline",
    expected_output: "Working MLOps pipeline with API, monitoring, and retraining capabilities",
    difficulty: "hard",
    category: "mlops",
    max_score: 100,
    time_limit: 90,
    status: "active",
    tags: ["mlops", "deployment", "monitoring", "api"],
    evaluation_criteria: {
      "code_quality": 25,
      "ml_knowledge": 20,
      "problem_solving": 25,
      "engineering": 30
    }
  },
  {
    title: "Debug and Optimize a Failing ML Pipeline",
    description: "Debug a machine learning pipeline that's experiencing performance issues and optimize it for production.",
    instructions: "You are given a machine learning pipeline that is experiencing several issues:

1. Poor model performance
2. Memory usage problems
3. Slow training times
4. Data quality issues
5. Code inefficiencies

Your task is to:
1. Identify and diagnose the problems
2. Fix data quality issues
3. Optimize the model and training process
4. Improve code efficiency
5. Implement proper error handling
6. Add monitoring and logging

The pipeline includes data loading, preprocessing, model training, and evaluation steps. You need to debug each component and provide an optimized solution.

Focus on:
- Root cause analysis
- Performance optimization
- Code refactoring
- Best practices implementation
- Production readiness",
    starter_code: "# This pipeline has several issues that need to be fixed
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load data (this has issues)
data = pd.read_csv('data.csv')

# Preprocessing (inefficient)
for col in data.columns:
    data[col] = data[col].fillna(data[col].mean())

# Model training (slow and inefficient)
model = RandomForestClassifier(n_estimators=1000, max_depth=50)
X = data.drop('target', axis=1)
y = data['target']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model.fit(X_train, y_train)
score = model.score(X_test, y_test)
print(f'Score: {score}')

# Your optimized solution here
",
    test_cases: "Test optimized pipeline performance and functionality",
    expected_output: "Optimized pipeline with improved performance, efficiency, and reliability",
    difficulty: "expert",
    category: "problem_solving",
    max_score: 100,
    time_limit: 120,
    status: "active",
    tags: ["debugging", "optimization", "performance", "best-practices"],
    evaluation_criteria: {
      "code_quality": 30,
      "ml_knowledge": 20,
      "problem_solving": 35,
      "engineering": 15
    }
  }
]

challenges.each do |challenge_data|
  challenge = Challenge.create!(challenge_data)
  puts "Created challenge: #{challenge.title} (#{challenge.difficulty})"
end

puts "\nCreating sample challenge attempts..."

# Create some sample challenge attempts
candidate1 = Candidate.first
candidate2 = Candidate.second
challenge1 = Challenge.first
challenge2 = Challenge.second

# Completed attempt
attempt1 = ChallengeAttempt.create!(
  candidate: candidate1,
  challenge: challenge1,
  status: "completed",
  score: 85,
  submitted_code: "import pandas as pd\nimport numpy as np\n# Well-structured preprocessing code...",
  evaluation_results: {
    code_quality_score: 80,
    ml_knowledge_score: 90,
    problem_solving_score: 85,
    engineering_score: 85,
    feedback_summary: "Good data preprocessing with proper handling of missing values and outliers. Code is well-structured and documented."
  }.to_json,
  started_at: 2.hours.ago,
  completed_at: 1.hour.ago
)

# In-progress attempt
attempt2 = ChallengeAttempt.create!(
  candidate: candidate2,
  challenge: challenge2,
  status: "in_progress",
  submitted_code: "import pandas as pd\n# Working on text preprocessing...",
  started_at: 30.minutes.ago
)

puts "Created challenge attempts"

puts "\nSeeding completed successfully!"
puts "Created #{Candidate.count} candidates"
puts "Created #{Challenge.count} challenges"
puts "Created #{ChallengeAttempt.count} challenge attempts"

puts "\nDemo credentials:"
puts "Email: demo@example.com"
puts "Password: password123"



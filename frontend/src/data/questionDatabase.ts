// ML ARCADE Question Database
// Comprehensive ML Engineering Questions with Progressive Difficulty

export interface Question {
  id: string;
  category: 'DATA_MATRIX' | 'NEURAL_FORGE' | 'PERFORMANCE_SCANNER' | 'CYBER_DEPLOYMENT';
  level: number; // 1-9 difficulty levels
  type: 'multiple_choice' | 'code_completion' | 'true_false' | 'fill_blank';
  title: string;
  question: string;
  code?: string; // Optional code snippet
  options?: string[]; // For multiple choice
  correct_answer: string | number;
  explanation: string;
  points: number;
  time_limit: number; // in seconds
  tags: string[];
}

export const QUESTION_DATABASE: Question[] = [
  // DATA MATRIX - LEVEL 1-3 (Basic Data Preprocessing)
  {
    id: 'dm_001',
    category: 'DATA_MATRIX',
    level: 1,
    type: 'multiple_choice',
    title: 'BASIC DATA SCANNING',
    question: 'Which pandas method is used to check for missing values in a DataFrame?',
    options: ['df.missing()', 'df.isna()', 'df.check_null()', 'df.find_missing()'],
    correct_answer: 1,
    explanation: 'df.isna() returns a boolean DataFrame indicating missing values. df.isnull() is an alias for the same function.',
    points: 100,
    time_limit: 30,
    tags: ['pandas', 'data-cleaning', 'basic']
  },
  {
    id: 'dm_002',
    category: 'DATA_MATRIX',
    level: 1,
    type: 'multiple_choice',
    title: 'MATRIX SHAPE ANALYSIS',
    question: 'What does df.shape return for a pandas DataFrame?',
    options: ['Total number of elements', 'A tuple (rows, columns)', 'Only the number of rows', 'The data types of columns'],
    correct_answer: 1,
    explanation: 'df.shape returns a tuple containing (number of rows, number of columns) in the DataFrame.',
    points: 100,
    time_limit: 20,
    tags: ['pandas', 'data-exploration', 'basic']
  },
  {
    id: 'dm_003',
    category: 'DATA_MATRIX',
    level: 2,
    type: 'code_completion',
    title: 'MISSING VALUE ELIMINATION',
    question: 'Complete the code to remove rows with ANY missing values:',
    code: 'df_clean = df.______()',
    correct_answer: 'dropna',
    explanation: 'dropna() removes rows with any missing values. Use dropna(how="all") to remove only rows where ALL values are missing.',
    points: 150,
    time_limit: 45,
    tags: ['pandas', 'data-cleaning', 'intermediate']
  },
  {
    id: 'dm_004',
    category: 'DATA_MATRIX',
    level: 2,
    type: 'multiple_choice',
    title: 'DATA TYPE CONVERSION',
    question: 'Which method converts a pandas Series to numeric values, handling errors?',
    options: ['to_numeric()', 'pd.to_numeric()', 'astype(float)', 'convert_numeric()'],
    correct_answer: 1,
    explanation: 'pd.to_numeric() can convert strings to numbers and handle errors with parameters like errors="coerce".',
    points: 150,
    time_limit: 40,
    tags: ['pandas', 'data-conversion', 'intermediate']
  },
  {
    id: 'dm_005',
    category: 'DATA_MATRIX',
    level: 3,
    type: 'multiple_choice',
    title: 'ADVANCED DATA ENCODING',
    question: 'What is the main advantage of using LabelEncoder vs OneHotEncoder?',
    options: [
      'LabelEncoder preserves ordinal relationships',
      'LabelEncoder uses less memory for high cardinality features',
      'LabelEncoder works better with tree-based models',
      'LabelEncoder is faster to compute'
    ],
    correct_answer: 1,
    explanation: 'LabelEncoder creates integer mappings (0,1,2...) using less memory than OneHotEncoder which creates binary columns. However, it implies false ordinal relationships.',
    points: 200,
    time_limit: 60,
    tags: ['scikit-learn', 'encoding', 'advanced']
  },

  // NEURAL FORGE - LEVEL 1-3 (Basic Model Training)
  {
    id: 'nf_001',
    category: 'NEURAL_FORGE',
    level: 1,
    type: 'multiple_choice',
    title: 'MODEL CONSTRUCTION BASICS',
    question: 'Which algorithm is best for binary classification problems?',
    options: ['Linear Regression', 'Logistic Regression', 'K-Means', 'PCA'],
    correct_answer: 1,
    explanation: 'Logistic Regression is specifically designed for binary classification, outputting probabilities between 0 and 1.',
    points: 100,
    time_limit: 30,
    tags: ['classification', 'algorithms', 'basic']
  },
  {
    id: 'nf_002',
    category: 'NEURAL_FORGE',
    level: 1,
    type: 'true_false',
    title: 'TRAINING DATA REQUIREMENTS',
    question: 'Supervised learning algorithms require labeled training data.',
    correct_answer: 'true',
    explanation: 'Supervised learning by definition requires input-output pairs (labeled data) to learn the mapping function.',
    points: 100,
    time_limit: 20,
    tags: ['supervised-learning', 'basic', 'concepts']
  },
  {
    id: 'nf_003',
    category: 'NEURAL_FORGE',
    level: 2,
    type: 'code_completion',
    title: 'MODEL INITIALIZATION',
    question: 'Complete the code to create a Random Forest classifier with 100 trees:',
    code: 'from sklearn.ensemble import RandomForestClassifier\nrf = RandomForestClassifier(n_estimators=_____)',
    correct_answer: '100',
    explanation: 'n_estimators parameter controls the number of trees in the Random Forest. More trees generally improve performance but increase computation time.',
    points: 150,
    time_limit: 45,
    tags: ['scikit-learn', 'random-forest', 'intermediate']
  },
  {
    id: 'nf_004',
    category: 'NEURAL_FORGE',
    level: 2,
    type: 'multiple_choice',
    title: 'HYPERPARAMETER OPTIMIZATION',
    question: 'What does the learning_rate parameter control in gradient boosting?',
    options: [
      'The number of boosting stages',
      'The contribution of each tree to the final prediction',
      'The maximum depth of trees',
      'The minimum samples per leaf'
    ],
    correct_answer: 1,
    explanation: 'Learning rate (shrinkage) scales the contribution of each tree. Lower values require more trees but often lead to better generalization.',
    points: 150,
    time_limit: 50,
    tags: ['gradient-boosting', 'hyperparameters', 'intermediate']
  },
  {
    id: 'nf_005',
    category: 'NEURAL_FORGE',
    level: 3,
    type: 'multiple_choice',
    title: 'NEURAL NETWORK ARCHITECTURE',
    question: 'What is the vanishing gradient problem in deep neural networks?',
    options: [
      'Gradients become too large during backpropagation',
      'Gradients become very small in early layers during backpropagation',
      'The model overfits to training data',
      'The learning rate is too high'
    ],
    correct_answer: 1,
    explanation: 'In deep networks, gradients can become exponentially smaller as they propagate backward, making early layers learn very slowly.',
    points: 200,
    time_limit: 60,
    tags: ['neural-networks', 'deep-learning', 'advanced']
  },

  // PERFORMANCE SCANNER - LEVEL 2-4 (Model Evaluation)
  {
    id: 'ps_001',
    category: 'PERFORMANCE_SCANNER',
    level: 2,
    type: 'multiple_choice',
    title: 'METRIC ANALYSIS',
    question: 'When should you use F1-score instead of accuracy?',
    options: [
      'When classes are balanced',
      'When classes are imbalanced',
      'When you have regression problems',
      'When you have clustering problems'
    ],
    correct_answer: 1,
    explanation: 'F1-score considers both precision and recall, making it better for imbalanced datasets where accuracy can be misleading.',
    points: 150,
    time_limit: 40,
    tags: ['metrics', 'evaluation', 'imbalanced-data']
  },
  {
    id: 'ps_002',
    category: 'PERFORMANCE_SCANNER',
    level: 2,
    type: 'code_completion',
    title: 'CROSS-VALIDATION SETUP',
    question: 'Complete the code for 5-fold cross-validation:',
    code: 'from sklearn.model_selection import cross_val_score\nscores = cross_val_score(model, X, y, cv=_____)',
    correct_answer: '5',
    explanation: 'cv=5 performs 5-fold cross-validation, splitting data into 5 folds and training/testing 5 times.',
    points: 150,
    time_limit: 35,
    tags: ['cross-validation', 'model-selection', 'scikit-learn']
  },
  {
    id: 'ps_003',
    category: 'PERFORMANCE_SCANNER',
    level: 3,
    type: 'multiple_choice',
    title: 'ROC CURVE INTERPRETATION',
    question: 'What does AUC-ROC measure?',
    options: [
      'The area under the precision-recall curve',
      'The area under the ROC curve, measuring separability',
      'The confusion matrix diagonal sum',
      'The mean squared error'
    ],
    correct_answer: 1,
    explanation: 'AUC-ROC measures the area under the ROC curve, indicating how well the model distinguishes between classes. AUC = 1 is perfect, AUC = 0.5 is random.',
    points: 200,
    time_limit: 50,
    tags: ['roc-curve', 'auc', 'binary-classification']
  },
  {
    id: 'ps_004',
    category: 'PERFORMANCE_SCANNER',
    level: 4,
    type: 'multiple_choice',
    title: 'BIAS-VARIANCE ANALYSIS',
    question: 'How does increasing model complexity typically affect bias and variance?',
    options: [
      'Increases both bias and variance',
      'Decreases both bias and variance',
      'Decreases bias, increases variance',
      'Increases bias, decreases variance'
    ],
    correct_answer: 2,
    explanation: 'More complex models can fit training data better (lower bias) but are more sensitive to training data variations (higher variance).',
    points: 250,
    time_limit: 60,
    tags: ['bias-variance', 'model-complexity', 'advanced']
  },

  // CYBER DEPLOYMENT - LEVEL 6-9 (MLOps)
  {
    id: 'cd_001',
    category: 'CYBER_DEPLOYMENT',
    level: 6,
    type: 'multiple_choice',
    title: 'MODEL SERIALIZATION',
    question: 'Which format is best for deploying scikit-learn models in production?',
    options: ['pickle', 'joblib', 'JSON', 'CSV'],
    correct_answer: 1,
    explanation: 'joblib is optimized for scikit-learn models and handles numpy arrays efficiently. It\'s faster than pickle for large models.',
    points: 300,
    time_limit: 45,
    tags: ['deployment', 'serialization', 'production']
  },
  {
    id: 'cd_002',
    category: 'CYBER_DEPLOYMENT',
    level: 7,
    type: 'multiple_choice',
    title: 'CONTAINER ORCHESTRATION',
    question: 'What is the primary benefit of using Docker for ML model deployment?',
    options: [
      'Faster model training',
      'Better model accuracy',
      'Environment consistency and portability',
      'Automatic hyperparameter tuning'
    ],
    correct_answer: 2,
    explanation: 'Docker containers ensure consistent environments across development, testing, and production, eliminating "works on my machine" issues.',
    points: 350,
    time_limit: 60,
    tags: ['docker', 'containerization', 'devops']
  },
  {
    id: 'cd_003',
    category: 'CYBER_DEPLOYMENT',
    level: 8,
    type: 'multiple_choice',
    title: 'MODEL MONITORING SYSTEMS',
    question: 'What is data drift in ML systems?',
    options: [
      'When model accuracy decreases over time',
      'When input data distribution changes from training data',
      'When the model takes too long to predict',
      'When the model uses too much memory'
    ],
    correct_answer: 1,
    explanation: 'Data drift occurs when the statistical properties of input features change over time, potentially degrading model performance.',
    points: 400,
    time_limit: 70,
    tags: ['monitoring', 'data-drift', 'production']
  },
  {
    id: 'cd_004',
    category: 'CYBER_DEPLOYMENT',
    level: 9,
    type: 'multiple_choice',
    title: 'A/B TESTING FRAMEWORKS',
    question: 'In ML A/B testing, what is a "champion-challenger" setup?',
    options: [
      'Testing two different datasets',
      'Comparing current production model vs new model',
      'Testing different hyperparameters',
      'Using different evaluation metrics'
    ],
    correct_answer: 1,
    explanation: 'Champion-challenger compares the current production model (champion) against a new model (challenger) with real traffic to determine which performs better.',
    points: 500,
    time_limit: 90,
    tags: ['ab-testing', 'model-comparison', 'expert']
  },

  // Additional High-Level Questions
  {
    id: 'nf_006',
    category: 'NEURAL_FORGE',
    level: 5,
    type: 'multiple_choice',
    title: 'ADVANCED REGULARIZATION',
    question: 'What is the key difference between L1 and L2 regularization?',
    options: [
      'L1 is faster to compute than L2',
      'L1 can drive weights to exactly zero, L2 shrinks them towards zero',
      'L2 is better for classification, L1 for regression',
      'L1 prevents overfitting, L2 prevents underfitting'
    ],
    correct_answer: 1,
    explanation: 'L1 regularization (Lasso) can eliminate features by setting weights to zero, while L2 (Ridge) shrinks weights but keeps them non-zero.',
    points: 250,
    time_limit: 55,
    tags: ['regularization', 'feature-selection', 'advanced']
  },
  {
    id: 'dm_006',
    category: 'DATA_MATRIX',
    level: 4,
    type: 'code_completion',
    title: 'FEATURE SCALING PROTOCOL',
    question: 'Complete the StandardScaler transformation:',
    code: 'from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler()\nX_scaled = scaler.______(X_train)',
    correct_answer: 'fit_transform',
    explanation: 'fit_transform() both fits the scaler on training data and transforms it. Use scaler.transform() for test data.',
    points: 200,
    time_limit: 40,
    tags: ['preprocessing', 'scaling', 'scikit-learn']
  }
];

// Utility functions for question management
export const getQuestionsByCategory = (category: string) => {
  return QUESTION_DATABASE.filter(q => q.category === category);
};

export const getQuestionsByLevel = (level: number) => {
  return QUESTION_DATABASE.filter(q => q.level === level);
};

export const getQuestionsByLevelRange = (minLevel: number, maxLevel: number) => {
  return QUESTION_DATABASE.filter(q => q.level >= minLevel && q.level <= maxLevel);
};

export const getRandomQuestions = (count: number, level?: number) => {
  let pool = level ? getQuestionsByLevel(level) : QUESTION_DATABASE;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const calculateScore = (questions: Question[], answers: (string | number)[]) => {
  let totalScore = 0;
  let correctAnswers = 0;

  questions.forEach((question, index) => {
    if (answers[index] === question.correct_answer) {
      totalScore += question.points;
      correctAnswers++;
    }
  });

  return {
    totalScore,
    correctAnswers,
    totalQuestions: questions.length,
    accuracy: (correctAnswers / questions.length) * 100
  };
};

// Level progression system
export const LEVEL_REQUIREMENTS = {
  1: { minScore: 0, questionsCount: 5 },
  2: { minScore: 400, questionsCount: 5 },
  3: { minScore: 800, questionsCount: 6 },
  4: { minScore: 1200, questionsCount: 6 },
  5: { minScore: 1600, questionsCount: 7 },
  6: { minScore: 2000, questionsCount: 7 },
  7: { minScore: 2500, questionsCount: 8 },
  8: { minScore: 3000, questionsCount: 8 },
  9: { minScore: 3500, questionsCount: 10 }
};

export const getNextLevel = (currentLevel: number, totalScore: number) => {
  for (let level = currentLevel + 1; level <= 9; level++) {
    if (totalScore >= LEVEL_REQUIREMENTS[level as keyof typeof LEVEL_REQUIREMENTS].minScore) {
      return level;
    }
  }
  return currentLevel;
};

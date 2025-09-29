class CreateChallengeAttempts < ActiveRecord::Migration[7.0]
  def change
    create_table :challenge_attempts do |t|
      t.references :candidate, null: false, foreign_key: true
      t.references :challenge, null: false, foreign_key: true
      t.integer :status, default: 0
      t.integer :score
      t.text :submitted_code
      t.text :evaluation_results
      t.text :feedback
      t.datetime :started_at
      t.datetime :completed_at
      t.json :metadata
      t.timestamps
    end

    add_index :challenge_attempts, [:candidate_id, :challenge_id]
    add_index :challenge_attempts, :status
    add_index :challenge_attempts, :score
    add_index :challenge_attempts, :started_at
    add_index :challenge_attempts, :completed_at
  end
end



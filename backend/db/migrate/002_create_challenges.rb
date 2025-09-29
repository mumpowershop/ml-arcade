class CreateChallenges < ActiveRecord::Migration[7.0]
  def change
    create_table :challenges do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.text :instructions, null: false
      t.text :starter_code
      t.text :test_cases
      t.text :expected_output
      t.string :difficulty, null: false
      t.string :category, null: false
      t.integer :max_score, null: false, default: 100
      t.integer :time_limit, null: false # in minutes
      t.integer :status, default: 0
      t.json :metadata
      t.json :evaluation_criteria
      t.string :tags, array: true, default: []
      t.timestamps
    end

    add_index :challenges, :difficulty
    add_index :challenges, :category
    add_index :challenges, :status
    add_index :challenges, :tags, using: 'gin'
  end
end



class CreateCandidates < ActiveRecord::Migration[7.0]
  def change
    create_table :candidates do |t|
      t.string :candidate_id, null: false, index: { unique: true }
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :phone
      t.text :bio
      t.string :linkedin_url
      t.string :github_url
      t.string :portfolio_url
      t.integer :experience_level, default: 0
      t.integer :status, default: 0
      t.json :preferences
      t.datetime :last_login_at
      t.timestamps
    end

    add_index :candidates, :email
    add_index :candidates, :candidate_id
    add_index :candidates, :status
  end
end

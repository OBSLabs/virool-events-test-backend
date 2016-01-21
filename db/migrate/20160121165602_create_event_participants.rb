class CreateEventParticipants < ActiveRecord::Migration
  def change
    create_table :event_participants do |t|
      t.string :name
      t.references :event, index: true

      t.timestamps null: false
    end
    add_foreign_key :event_participants, :events
  end
end

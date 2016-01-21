class CreateEventParticipantsEvents < ActiveRecord::Migration
  def change
    create_table :event_participants_events, id: false do |t|
      t.integer :event_id
      t.integer :event_participant_id
    end
  end
end

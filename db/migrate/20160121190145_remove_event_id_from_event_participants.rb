class RemoveEventIdFromEventParticipants < ActiveRecord::Migration
  def change
    remove_column :event_participants, :event_id, :string
  end
end

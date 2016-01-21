class Event < ActiveRecord::Base
  has_and_belongs_to_many :participants, class_name: "EventParticipant"
end

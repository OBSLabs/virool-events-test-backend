class EventsController < ApplicationController
  before_action :pull_event, except: [:index]

  def index
    @events = Event.all
  end

  def show
  end

  def participants
  end

  private
  def pull_event
    @event = Event.find(params[:event_id])
  end
end

# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

alex = EventParticipant.create({name: "Alex D."})
vlad = EventParticipant.create({name: "Vlad G."})

event = Event.create([
  {
    title: "IMEDIA AGENCY SUMMIT",
    description: "This iMedia Agency Summit will delve into the collision of automation and creativity -- and how marketers can use the former to encourage the latter. Featuring Michelle Burnham (VP Media Activation, HUGE) as a Summit Host and Sandra Sims-Williams (Chief Diversity Officer, Publicis Groupe) as a keynote.",
    picture_url: "https://virool-events.s3.amazonaws.com/uploads/event_to_visit/picture/7/agencynotext.jpg",
    participants: [alex]
  },
  {
  title: "DMEXCO",
  description: "The dmexco (digital marketing exposition & conference) is an international exposition and conference for the digital industry, that takes place every September in Cologne, Germany. It consists of a trade fair and a conference.",
  picture_url: "http://www.osmii.com/blog/wp-content/uploads/2014/09/DMexco6.jpg",
  participants: [alex, vlad]
  }
])
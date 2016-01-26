json.array!(@event.participants) do |p|
  json.id p.id
  json.name p.name
end


select= (request) ->
  
  return plv8.__execute(request.select, request.values)

module.exports= select
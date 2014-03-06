select= (request) ->
  console.log(request)
  fields = ["*"] or request.fields
  where = "" or request.where
  
  return plv8.execute("select #{fields.join(",")} from #{request.object} #{where}" )

module.exports= select
const User = mongoose.model('User', {
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required:true
  }
});
let user = new User({
  email:'adri', password:'abc'
})
user.save().then((result)=> {
  console.log('user saved');
}).catch((err)=>{console.log(err)})

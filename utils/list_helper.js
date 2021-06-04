/* eslint-disable no-unused-vars */
const dummy = (blogs) => {
  return 1
}
  
const totalLikes = (blogs) => {
  let likes = blogs.map(blog => blog.likes)
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  return likes.reduce(reducer)
}

const favoriteBlog = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const max = Math.max.apply(null, likes)
  const index = likes.findIndex(like => like === max)
  return blogs[index]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
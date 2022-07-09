export default (commentText: string) => {
  return commentText.slice(0, 250) + '...';
};

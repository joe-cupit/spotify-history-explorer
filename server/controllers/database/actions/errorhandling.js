const tryCatchWrapper = (func) => async (...args) => {
  try {
    return await func(...args);
  } catch (err) {
    console.log('[MongoDB] Encountered an error');
    console.log('[MongoDB]', err);
    return null;
  }
}


module.exports = tryCatchWrapper

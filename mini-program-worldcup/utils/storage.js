// wx.Storage wrapper with same API surface as localStorage

function get(key) {
  try {
    const val = wx.getStorageSync(key);
    return val !== '' && val !== undefined ? val : null;
  } catch (e) {
    return null;
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value);
  } catch (e) {
    console.error('Storage set failed:', key, e);
  }
}

function remove(key) {
  try {
    wx.removeStorageSync(key);
  } catch (e) {
    console.error('Storage remove failed:', key, e);
  }
}

function getJSON(key) {
  try {
    const raw = wx.getStorageSync(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setJSON(key, value) {
  try {
    wx.setStorageSync(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage setJSON failed:', key, e);
  }
}

module.exports = { get, set, remove, getJSON, setJSON };

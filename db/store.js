const mongoose = require('mongoose');
const { seedEvents, seedClubs, seedStudents, seedRegistrations } = require('../seeds/seedData');

// In-memory collections initialized with seed data as fallback
let memEvents = JSON.parse(JSON.stringify(seedEvents));
let memClubs = JSON.parse(JSON.stringify(seedClubs));
let memStudents = JSON.parse(JSON.stringify(seedStudents));
let memRegistrations = JSON.parse(JSON.stringify(seedRegistrations));

// Add _id to in-memory items if not present
memEvents.forEach(e => { if (!e._id) e._id = '65f' + Math.random().toString(16).substring(2, 23); });
memClubs.forEach(c => { if (!c._id) c._id = '65f' + Math.random().toString(16).substring(2, 23); });
memStudents.forEach(s => { if (!s._id) s._id = '65f' + Math.random().toString(16).substring(2, 23); });
memRegistrations.forEach(r => { if (!r._id) r._id = '65f' + Math.random().toString(16).substring(2, 23); });

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// Memory Query Builder supporting chaining (.sort, .limit)
class MemoryQuery {
  constructor(dataPromise) {
    this.promise = Promise.resolve(dataPromise);
  }

  sort(sortObj) {
    this.promise = this.promise.then(items => {
      if (!Array.isArray(items)) return items;
      const copy = [...items];
      const keys = Object.keys(sortObj || {});
      if (keys.length === 0) return copy;
      const key = keys[0];
      const dir = sortObj[key] >= 0 ? 1 : -1;
      return copy.sort((a, b) => {
        if (a[key] < b[key]) return -1 * dir;
        if (a[key] > b[key]) return 1 * dir;
        return 0;
      });
    });
    return this;
  }

  limit(num) {
    this.promise = this.promise.then(items => {
      if (!Array.isArray(items)) return items;
      return items.slice(0, num);
    });
    return this;
  }

  then(resolve, reject) {
    return this.promise.then(resolve, reject);
  }

  catch(reject) {
    return this.promise.catch(reject);
  }
}

// Generic Model Adapter
function createModelAdapter(modelName, inMemoryList) {
  return {
    async countDocuments(filter = {}) {
      if (isDbConnected()) {
        try {
          return await mongoose.model(modelName).countDocuments(filter);
        } catch (e) {
          // fallback to memory
        }
      }
      return inMemoryList.length;
    },

    find(filter = {}) {
      if (isDbConnected()) {
        try {
          return mongoose.model(modelName).find(filter);
        } catch (e) {
          // fallback
        }
      }

      const matchFn = (item) => {
        for (const k of Object.keys(filter)) {
          if (filter[k] instanceof RegExp) {
            if (!filter[k].test(item[k])) return false;
          } else if (typeof filter[k] === 'object' && filter[k] !== null && filter[k].$ne) {
            if (item[k] === filter[k].$ne) return false;
          } else if (item[k] !== filter[k]) {
            return false;
          }
        }
        return true;
      };

      const matched = inMemoryList.filter(matchFn);
      return new MemoryQuery(matched);
    },

    async findOne(filter = {}) {
      if (isDbConnected()) {
        try {
          const res = await mongoose.model(modelName).findOne(filter);
          if (res) return res;
        } catch (e) {
          // fallback
        }
      }

      for (const item of inMemoryList) {
        let match = true;
        for (const k of Object.keys(filter)) {
          if (k === '$or') {
            const orMatch = filter.$or.some(subFilter => {
              const subKey = Object.keys(subFilter)[0];
              return item[subKey] === subFilter[subKey];
            });
            if (!orMatch) { match = false; break; }
          } else if (filter[k] instanceof RegExp) {
            if (!filter[k].test(item[k])) { match = false; break; }
          } else if (item[k] !== filter[k]) {
            match = false;
            break;
          }
        }
        if (match) return JSON.parse(JSON.stringify(item));
      }
      return null;
    },

    async findById(id) {
      if (isDbConnected()) {
        try {
          return await mongoose.model(modelName).findById(id);
        } catch (e) {
          // fallback
        }
      }
      const item = inMemoryList.find(x => x._id === id || x.eventId === id || x.clubId === id || x.studentId === id || x.registrationId === id);
      return item ? JSON.parse(JSON.stringify(item)) : null;
    },

    async create(doc) {
      if (isDbConnected()) {
        try {
          return await mongoose.model(modelName).create(doc);
        } catch (e) {
          // fallback
        }
      }

      const newDoc = {
        ...doc,
        _id: '65f' + Math.random().toString(16).substring(2, 23),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      inMemoryList.push(newDoc);
      return newDoc;
    },

    async findOneAndUpdate(filter, update, opts = {}) {
      if (isDbConnected()) {
        try {
          return await mongoose.model(modelName).findOneAndUpdate(filter, update, opts);
        } catch (e) {
          // fallback
        }
      }

      let item = inMemoryList.find(x => {
        for (const k of Object.keys(filter)) {
          if (x[k] !== filter[k]) return false;
        }
        return true;
      });

      if (!item) return null;

      const dataToSet = update.$set || update;
      Object.assign(item, dataToSet);
      item.updatedAt = new Date().toISOString();
      return JSON.parse(JSON.stringify(item));
    },

    async updateOne(filter, update) {
      if (isDbConnected()) {
        try {
          return await mongoose.model(modelName).updateOne(filter, update);
        } catch (e) {
          // fallback
        }
      }

      let item = inMemoryList.find(x => {
        for (const k of Object.keys(filter)) {
          if (x[k] !== filter[k]) return false;
        }
        return true;
      });

      if (!item) return { modifiedCount: 0 };

      if (update.$inc) {
        for (const incKey of Object.keys(update.$inc)) {
          item[incKey] = (item[incKey] || 0) + update.$inc[incKey];
        }
      }
      if (update.$set) {
        Object.assign(item, update.$set);
      }
      return { modifiedCount: 1 };
    },

    async deleteOne(filter) {
      if (isDbConnected()) {
        try {
          return await mongoose.model(modelName).deleteOne(filter);
        } catch (e) {
          // fallback
        }
      }

      const idx = inMemoryList.findIndex(x => {
        for (const k of Object.keys(filter)) {
          if (x[k] !== filter[k]) return false;
        }
        return true;
      });

      if (idx !== -1) {
        inMemoryList.splice(idx, 1);
        return { deletedCount: 1 };
      }
      return { deletedCount: 0 };
    }
  };
}

module.exports = {
  Event: createModelAdapter('Event', memEvents),
  Club: createModelAdapter('Club', memClubs),
  Student: createModelAdapter('Student', memStudents),
  Registration: createModelAdapter('Registration', memRegistrations),
  isDbConnected
};

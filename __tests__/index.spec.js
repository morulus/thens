import thens from '../src'; 

describe('Flowable', () => {
  it('Simple', () => {
    const sequence = thens(
      ({ a }) => a + 1,
      b => b + 1,
    );
    expect(typeof sequence).toBe('function');
    return sequence({
      a: 0,
    }).then(function(props) {
      expect(props).toBe(2);
    });
  });
  
  it('Like async', () => {
    const sequence = thens(
      ({ a }) => Promise.resolve(a + 1),
      b => b + 1,
    );
    expect(typeof sequence).toBe('function');
    return sequence({
      a: 0,
    }).then(function(props) {
      expect(props).toBe(2);
    });
  });
  
  it('Async', () => {
    const sequence = thens(
      ({ a }) => new Promise((r) => setTimeout(() => r(a + 1), 10)),
      b => b + 1,
    );
    expect(typeof sequence).toBe('function');
    return sequence({
      a: 0,
    }).then(function(props) {
      expect(props).toBe(2);
    });
  });
  
  it('Async all', () => {
    const sequence = thens(
      [
        a => new Promise((r) => setTimeout(() => r(a + 1), 10)),
        a => new Promise((r) => setTimeout(() => r(a + 2), 15)),
        a => new Promise((r) => setTimeout(() => r(a + 3), 20)),
      ]
    );
    expect(typeof sequence).toBe('function');
    return sequence(1).then(function(props) {
      expect(props).toMatchObject([2, 3, 4]);
    });
  });
  
  it('Example', () => {
    const calc = thens(
      a => a + 1,
      b => Promise.resolve(b + 1),
      c => new Promise((resolve) => setTimeout(() => resolve(c + 1))),
      [
        d => d + 1,
        d => Promise.resolve(d + 2),
        d => new Promise((resolve) => setTimeout(() => resolve(d + 3))),
      ],
      function* ([e, f, g]) {
        const h = yield Promise.resolve(e + f + g);
        try {
          throw new Error('Special error');
        } catch(e) {
          return h;
        }
      }
    );
    
    return calc(0)
    .then(function(result) {
      expect(result).toBe(15);
    });
  })
  
  it('Use generator', () => {
    function* generatorPlus(c) {
      return Promise.resolve(c + 1);
    }
    const calc = thens(
      a => a + 1, // Gives 1
      function* (b) {
        const c = yield Promise.resolve(b + 1);
        const d = yield generatorPlus(c);
        return d;
      }
    );
    
    return calc(0)
    .then(function(result) {
      expect(result).toBe(3);
    });
  });
  
  
  it('Generator caught continue', () => {
    function* generatorPlus(c) {
      return Promise.resolve(c + 1);
    }
    const calc = thens(
      a => a + 1, // Gives 1
      function* (b) {
        const c = yield Promise.resolve(b + 1);
        try {
          throw new Error('Oups');
        } catch (e) {
          const feedback = yield Promise.resolve(`No, ${e.message}`);
          return feedback;
        }
      }
    );
    
    return calc(0)
    .then(function(result) {
      expect(result).toBe('No, Oups');
    });
  });
  
  it('Generator finally', () => {
    function* generatorPlus(c) {
      return Promise.resolve(c + 1);
    }
    const calc = thens(
      a => a + 1, // Gives 1
      function* (b) {
        const c = yield Promise.resolve(b + 1);
        try {
          throw new Error('Oups');
        } finally {
          return 'Not matter';
        }
      }
    );
    
    return calc(0)
    .then(function(result) {
      expect(result).toBe('Not matter');
    });
  });
  
  it('Invalid types', async () => {
    expect(function() {
      const calc = thens(
        a => a + 1, // Gives 1
        {},
      );
    }).toThrowError('Invalid argument of type object passed to thens. Expects function | array | promise or generator.');
  });
  
  it('Catch errors', () => {
    const calc = thens(
      a => a + 1,
      function() {
        throw new Error('Abrashvabra');
      }
    );
    
    return calc(0)
    .catch(function(e) {
      expect(e.message).toBe('Abrashvabra');
      return 'ok';
    })
    .then(function(result) {
      expect(result).toBe('ok');
    });
  })
});
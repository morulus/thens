import chain from '../src'; 

describe('Flowable', () => {
  it('Simple', () => {
    const sequence = chain(
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
    const sequence = chain(
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
    const sequence = chain(
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
    const sequence = chain(
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
    const calc = chain(
      a => a + 1, // Gives 1
      b => Promise.resolve(b + 1), // Gives 2
      c => new Promise((resolve) => setTimeout(() => resolve(c + 1))), // Gives 3
      [
        d => d + 1, // = 4
        e => Promise.resolve(e + 2), // = 5
        f => new Promise((resolve) => setTimeout(() => resolve(f + 3))), // = 6
      ]
    );
    
    return calc(0)
    .then(function(result) {
      expect(result).toMatchObject([4, 5, 6]);
    });
  })
});
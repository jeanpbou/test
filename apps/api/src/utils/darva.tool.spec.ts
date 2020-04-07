import {
  IdentifierObject,
  serializeIdentifier,
  deserializeIdentifiers,
} from './darva.tool';
describe('Darva tools', () => {
  describe('serializeIdentifier', () => {
    describe('MessageIdentifier', () => {
      it('should return the built id without sectorielcode in properties', () => {
        const identifier: IdentifierObject = {
          type: 'ME',
          version: '01',
          release: '02',
          numero: '03',
        };
        const expected = 'ME030102';
        expect(serializeIdentifier(identifier)).toBe(expected);
      });

      it('should return the built id with sectorielcode when it presents in properties', () => {
        const identifier: IdentifierObject = {
          type: 'ME',
          version: '01',
          release: '02',
          numero: '03',
          sectorielcode: '04',
        };
        const expected = 'ME03010204';
        expect(serializeIdentifier(identifier)).toBe(expected);
      });
    });

    describe('NonMessageIdentifier', () => {
      it('should return the built id', () => {
        const identifier: IdentifierObject = {
          type: 'SE',
          version: '01',
          release: '02',
          code: '03',
        };
        const expected = 'SE030102';
        expect(serializeIdentifier(identifier)).toBe(expected);
      });
    });
  });

  describe('deserializeIdentifiers', () => {
    it('should return a message identifier properties in case of "ME" id', () => {
      const ids = ['ME120101', 'ME100203'];
      const expected = [
        { numero: '12', version: '01', release: '01' },
        { numero: '10', version: '02', release: '03' },
      ];
      expect(deserializeIdentifiers(ids)).toEqual(expected);
    });

    it('should return a message identifier properties whith sectorielCode if present', () => {
      const ids = ['ME12010105', 'ME100203'];
      const expected = [
        { numero: '12', version: '01', release: '01', sectorielCode: '05' },
        { numero: '10', version: '02', release: '03' },
      ];
      expect(deserializeIdentifiers(ids)).toEqual(expected);
    });

    it('should return a non message identifier properties in other case', () => {
      const ids = ['SE1200101', 'DE10000203'];
      const expected = [
        { code: '120', version: '01', release: '01' },
        { code: '1000', version: '02', release: '03' },
      ];
      expect(deserializeIdentifiers(ids)).toEqual(expected);
    });
  });
});

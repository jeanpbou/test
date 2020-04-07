type MessageIdentifier = {
  type: Extract<Type, 'ME'>;
  numero: string;
  version: string;
  release: string;
  sectorielcode?: string;
};
type NonMessageIdentifier = {
  type: Exclude<Type, 'ME'>;
  code: string;
  version: string;
  release: string;
};
export type IdentifierObject = MessageIdentifier | NonMessageIdentifier;

export type Type = 'SE' | 'GR' | 'DT' | 'DC' | 'DE' | 'ME';

/**
 * Type guard function for MessageIdentifier type
 *
 * @param identifier - object to type guard
 */
const isMessageIdentifier = (
  identifier: IdentifierObject,
): identifier is MessageIdentifier => {
  return 'numero' in identifier;
};

/**
 * Transform an Identifier object to a string unique identifier
 *
 * > NB: Handles Message and NonMessage differently
 *
 * @param identifier - identifier to serialize
 */
export const serializeIdentifier = (identifier: IdentifierObject) => {
  const { type, version, release } = identifier;
  const id = isMessageIdentifier(identifier)
    ? identifier.numero
    : identifier.code;
  const sectoriel = isMessageIdentifier(identifier)
    ? identifier.sectorielcode
    : undefined;

  return `${type}${id}${version}${release}${sectoriel ? sectoriel : ''}`;
};

/**
 * Transform string identifiers to correct identifier object
 *
 * @param identifiers - array of unique string identifiers
 */
export const deserializeIdentifiers = (identifiers: string[]) =>
  identifiers.map((i) => {
    const id = i.toUpperCase();
    const type = id.substring(0, 2);
    const delta = type === 'ME' ? 0 : ['SE', 'GR'].includes(type) ? 1 : 2;
    const numero = id.substring(2, 4 + delta);
    const version = id.substring(4 + delta, 6 + delta);
    const release = id.substring(6 + delta, 8 + delta);
    const sectoriel = delta === 0 && id.substring(8 + delta, 10 + delta);

    const idKey = type === 'ME' ? 'numero' : 'code';

    const deserialized = {
      [idKey]: numero,
      version,
      release,
    };

    if (sectoriel && type === 'ME') {
      deserialized.sectorielCode = sectoriel;
    }

    return deserialized;
  });

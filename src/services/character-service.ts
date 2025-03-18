import { Character } from '../entities/character';
import { createNewCharacter } from '../repositories/character-repository';

export const createNewCharacterService = async (
  character: Character,
): Promise<void> => {
  await createNewCharacter(character);
};

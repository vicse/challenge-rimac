import {
  directorDtoToEntityMapper,
  filmDtoToEntityMapper,
} from '../../src/mappers/film-mapper';
import { ISwapiFilmResponse } from '../../src/providers/interfaces/swapi-film-response';
import { ITheMovieApiDirectorResponse } from '../../src/providers/interfaces/movie-api-response';

describe('film-mapper.ts', () => {
  describe('filmDtoToEntityMapper.ts', () => {
    it('should be return the correct entity', () => {
      const dto: ISwapiFilmResponse = {
        title: 'Return of the Jedi',
        episode_id: 6,
        opening_crawl: 'Luke Skywalker',
        director: 'Richard Marquand',
        producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
        release_date: new Date('1983-05-25'),
        characters: ['https://swapi.dev/api/people/1/'],
        planets: ['https://swapi.dev/api/planets/1/'],
        starships: ['https://swapi.dev/api/starships/2/'],
        vehicles: ['https://swapi.dev/api/vehicles/8/'],
        species: ['https://swapi.dev/api/species/1/'],
        created: new Date('2014-12-18T10:39:33.255000Z'),
        edited: new Date('2014-12-20T09:48:37.462000Z'),
        url: 'https://swapi.dev/api/films/3/',
      };

      const result = filmDtoToEntityMapper(dto);

      expect(result).toEqual({
        title: 'Return of the Jedi',
        opening_crawl: 'Luke Skywalker',
        director_name: 'Richard Marquand',
        producer: 'Howard G. Kazanjian, George Lucas, Rick McCallum',
      });
    });
  });

  describe('directorDtoToEntityMapper.ts', () => {
    it('should be return the correct entity', () => {
      const dto: ITheMovieApiDirectorResponse = {
        adult: false,
        gender: 2,
        id: 10930,
        known_for_department: 'Directing',
        name: 'Irvin Kershner',
        original_name: 'Irvin Kershner',
        popularity: 0.029,
        profile_path: '/imtFUtcASoh2e1Emtt62UuFkIWA.jpg',
        known_for: [
          {
            backdrop_path: '/dMZxEdrWIzUmUoOz2zvmFuutbj7.jpg',
            id: 1891,
            title: 'The Empire Strikes Back',
            original_title: 'The Empire Strikes Back',
            overview:
              'The epic saga continues as Luke Skywalker, in hopes of defeating the evil Galactic Empire, learns the ways of the Jedi from aging master Yoda. But Darth Vader is more determined than ever to capture Luke. Meanwhile, rebel leader Princess Leia, cocky Han Solo, Chewbacca, and droids C-3PO and R2-D2 are thrown into various stages of capture, betrayal and despair.',
            poster_path: '/nNAeTmF4CtdSgMDplXTDPOpYzsX.jpg',
            media_type: 'movie',
            adult: false,
            original_language: 'en',
            genre_ids: [12, 28, 878],
            popularity: 3.009,
            release_date: new Date('1980-05-20'),
            video: false,
            vote_average: 8.391,
            vote_count: 17250,
          },
          {
            backdrop_path: '/cT0YCYCtAQC8wi56VWK1JRGgk3a.jpg',
            id: 5549,
            title: 'RoboCop 2',
            original_title: 'RoboCop 2',
            overview:
              'After a successful deployment of the RoboCop Law Enforcement unit, OCP sees its goal of urban pacification come closer and closer, but as this develops, a new narcotic known as "Nuke" invades the streets led by God-delirious leader Cane. As this menace grows, it may prove to be too much for Murphy to handle. OCP tries to replicate the success of the first unit, but ends up with failed prototypes with suicidal issues... until Dr. Faxx, a scientist straying away from OCP\'s path, uses Cane as the new subject for the RoboCop 2 project, a living God.',
            poster_path: '/uL3Ab6SOcN35ZTF2XrE1NzFwXdl.jpg',
            media_type: 'movie',
            adult: false,
            original_language: 'en',
            genre_ids: [28, 12, 80, 878, 53],
            popularity: 3.567,
            release_date: new Date('1990-06-22'),
            video: false,
            vote_average: 6.007,
            vote_count: 1922,
          },
          {
            backdrop_path: '/43VeglojU12NbT9AbuIWqTZOvpS.jpg',
            id: 36670,
            title: 'Never Say Never Again',
            original_title: 'Never Say Never Again',
            overview:
              "James Bond returns as the secret agent 007 to battle the evil organization SPECTRE. Bond must defeat Largo, who has stolen two atomic warheads for nuclear blackmail. But Bond has an ally in Largo's girlfriend, the willowy Domino, who falls for Bond and seeks revenge.",
            poster_path: '/zhoAL4o1STGgLbLxJ9r1ijfyHC9.jpg',
            media_type: 'movie',
            adult: false,
            original_language: 'en',
            genre_ids: [12, 28, 53],
            popularity: 3.829,
            release_date: new Date('1983-10-07'),
            video: false,
            vote_average: 6.048,
            vote_count: 1474,
          },
        ],
      };

      const result = directorDtoToEntityMapper(dto);

      expect(result).toEqual({
        id: 10930,
        name: 'Irvin Kershner',
        image_url: '/imtFUtcASoh2e1Emtt62UuFkIWA.jpg',
        other_films: [
          'The Empire Strikes Back',
          'RoboCop 2',
          'Never Say Never Again',
        ],
      });
    });
  });
});

import { IntervalService } from '../../src/services/interval.service';
import { IMovieRepository } from '../../src/domain/interfaces/repositories/IMovieRepository';
import { IProducerRepository } from '../../src/domain/interfaces/repositories/IProducerRepository';
import { Movie } from '../../src/domain/entities/Movie';
import { Producer } from '../../src/domain/entities/Producer';

describe('IntervalService', () => {
  let service: IntervalService;
  let mockMovieRepository: jest.Mocked<IMovieRepository>;
  let mockProducerRepository: jest.Mocked<IProducerRepository>;

  beforeEach(() => {
    mockMovieRepository = {
      findAllWinners: jest.fn(),
      findWinnersByProducer: jest.fn(),
    };

    mockProducerRepository = {
      findAll: jest.fn(),
      findWithMultipleWins: jest.fn(),
    };

    service = new IntervalService(mockMovieRepository, mockProducerRepository);
  });

  describe('calculateIntervals', () => {
    it('should return empty arrays when no producers have multiple wins', async () => {
      mockProducerRepository.findWithMultipleWins.mockResolvedValue([]);

      const result = await service.calculateIntervals();

      expect(result.min).toEqual([]);
      expect(result.max).toEqual([]);
    });

    it('should calculate intervals correctly for single producer', async () => {
      const producer: Producer = { id: 1, name: 'Test Producer' };
      const movies: Movie[] = [
        { id: 1, year: 2020, title: 'Movie 1', studios: 'Studio 1', winner: true },
        { id: 2, year: 2022, title: 'Movie 2', studios: 'Studio 2', winner: true },
      ];

      mockProducerRepository.findWithMultipleWins.mockResolvedValue([producer]);
      mockMovieRepository.findWinnersByProducer.mockResolvedValue(movies);

      const result = await service.calculateIntervals();

      expect(result.min).toHaveLength(1);
      expect(result.min[0].producer).toBe('Test Producer');
      expect(result.min[0].interval).toBe(2);
      expect(result.min[0].previousWin).toBe(2020);
      expect(result.min[0].followingWin).toBe(2022);
      expect(result.max).toHaveLength(1);
    });

    it('should find min and max intervals correctly', async () => {
      const producers: Producer[] = [
        { id: 1, name: 'Producer A' },
        { id: 2, name: 'Producer B' },
      ];

      const moviesA: Movie[] = [
        { id: 1, year: 2020, title: 'Movie A1', studios: 'Studio A', winner: true },
        { id: 2, year: 2021, title: 'Movie A2', studios: 'Studio A', winner: true },
      ];

      const moviesB: Movie[] = [
        { id: 3, year: 2020, title: 'Movie B1', studios: 'Studio B', winner: true },
        { id: 4, year: 2025, title: 'Movie B2', studios: 'Studio B', winner: true },
      ];

      mockProducerRepository.findWithMultipleWins.mockResolvedValue(producers);
      mockMovieRepository.findWinnersByProducer
        .mockResolvedValueOnce(moviesA)
        .mockResolvedValueOnce(moviesB);

      const result = await service.calculateIntervals();

      expect(result.min).toHaveLength(1);
      expect(result.min[0].interval).toBe(1);
      expect(result.min[0].producer).toBe('Producer A');

      expect(result.max).toHaveLength(1);
      expect(result.max[0].interval).toBe(5);
      expect(result.max[0].producer).toBe('Producer B');
    });

    it('should skip producers with less than 2 wins', async () => {
      const producer: Producer = { id: 1, name: 'Producer A' };
      const movies: Movie[] = [
        { id: 1, year: 2020, title: 'Movie 1', studios: 'Studio 1', winner: true },
      ];

      mockProducerRepository.findWithMultipleWins.mockResolvedValue([producer]);
      mockMovieRepository.findWinnersByProducer.mockResolvedValue(movies);

      const result = await service.calculateIntervals();

      expect(result.min).toEqual([]);
      expect(result.max).toEqual([]);
    });
  });
});

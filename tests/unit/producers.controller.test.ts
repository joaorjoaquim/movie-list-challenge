import { ProducersController } from '../../src/controllers/producers.controller';
import { IIntervalService } from '../../src/domain/interfaces/services/IIntervalService';
import { IRequest } from '../../src/domain/interfaces/http/IRequest';
import { IResponse } from '../../src/domain/interfaces/http/IResponse';

describe('ProducersController', () => {
  let controller: ProducersController;
  let mockIntervalService: jest.Mocked<IIntervalService>;
  let mockRequest: IRequest;
  let mockResponse: jest.Mocked<IResponse>;

  beforeEach(() => {
    mockIntervalService = {
      calculateIntervals: jest.fn(),
    };

    mockRequest = {
      body: {},
      params: {},
      query: {},
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    controller = new ProducersController(mockIntervalService);
  });

  describe('getIntervals', () => {
    it('should return intervals successfully', async () => {
      const mockIntervals = {
        min: [
          { producer: 'Producer A', interval: 1, previousWin: 2020, followingWin: 2021 },
        ],
        max: [
          { producer: 'Producer B', interval: 5, previousWin: 2015, followingWin: 2020 },
        ],
      };

      mockIntervalService.calculateIntervals.mockResolvedValue(mockIntervals);

      await controller.getIntervals(mockRequest, mockResponse);

      expect(mockIntervalService.calculateIntervals).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockIntervals);
    });

    it('should handle errors and return 500', async () => {
      mockIntervalService.calculateIntervals.mockRejectedValue(new Error('Database error'));

      await controller.getIntervals(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});

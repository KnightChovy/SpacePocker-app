import { BuildingService } from '../building.service';
import { IBuildingRepository } from '../../interface/building.repository.interface';
import { BadRequestError, NotFoundError } from '../../core/error.response';

describe('BuildingService', () => {
  let buildingService: BuildingService;
  let mockRepo: jest.Mocked<IBuildingRepository>;

  const mockBuilding = {
    id: '1',
    buildingName: 'Building A',
    address: '123 Main St',
    description: 'Test building',
    campus: 'Main Campus',
    managerId: 'mgr-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    buildingService = new BuildingService(mockRepo);
    jest.clearAllMocks();
  });

  describe('createBuilding', () => {
    const validData = {
      buildingName: 'Building A',
      address: '123 Main St',
      campus: 'Main Campus',
      managerId: 'mgr-1',
    };

    it('should create building successfully', async () => {
      mockRepo.create.mockResolvedValue(mockBuilding);
      const result = await buildingService.createBuilding(validData);
      expect(result.createBuilding).toEqual(mockBuilding);
      expect(mockRepo.create).toHaveBeenCalledWith(validData);
    });

    it('should throw error if buildingName missing', async () => {
      await expect(
        buildingService.createBuilding({ ...validData, buildingName: '' }),
      ).rejects.toThrow('Name and address are required');
    });

    it('should throw error if address missing', async () => {
      await expect(
        buildingService.createBuilding({ ...validData, address: '' }),
      ).rejects.toThrow('Name and address are required');
    });

    it('should throw error if campus missing', async () => {
      await expect(
        buildingService.createBuilding({ ...validData, campus: '' }),
      ).rejects.toThrow('Campus is required');
    });

    it('should throw error if managerId missing', async () => {
      await expect(
        buildingService.createBuilding({ ...validData, managerId: '' }),
      ).rejects.toThrow('Manager ID is required');
    });
  });

  describe('getBuildingById', () => {
    it('should get building by id', async () => {
      mockRepo.findById.mockResolvedValue(mockBuilding);
      const result = await buildingService.getBuildingById('1');
      expect(result.building).toEqual(mockBuilding);
    });

    it('should throw error if id empty', async () => {
      await expect(buildingService.getBuildingById('')).rejects.toThrow(
        'Building ID is required!',
      );
    });

    it('should throw error if building not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(buildingService.getBuildingById('999')).rejects.toThrow(
        NotFoundError,
      );
    });
  });

  describe('getAllBuildings', () => {
    it('should get all buildings with default pagination', async () => {
      const mockBuilding2 = {
        ...mockBuilding,
        id: '2',
        buildingName: 'Building B',
      };
      mockRepo.count.mockResolvedValue(2);
      mockRepo.findAll.mockResolvedValue([mockBuilding, mockBuilding2]);
      const result = await buildingService.getAllBuildings({});
      expect(result.pagination).toEqual({
        total: 2,
        limit: 10,
        offset: 0,
        hasMore: false,
      });
      expect(mockRepo.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
        10,
        0,
      );
    });

    it('should search by name', async () => {
      mockRepo.count.mockResolvedValue(1);
      mockRepo.findAll.mockResolvedValue([mockBuilding]);
      await buildingService.getAllBuildings({ search: 'Building A' });
      expect(mockRepo.count).toHaveBeenCalledWith({
        buildingName: { contains: 'Building A', mode: 'insensitive' },
      });
    });

    it('should filter by campus', async () => {
      mockRepo.count.mockResolvedValue(1);
      mockRepo.findAll.mockResolvedValue([mockBuilding]);
      await buildingService.getAllBuildings({ campus: 'Main Campus' });
      expect(mockRepo.count).toHaveBeenCalledWith({ campus: 'Main Campus' });
    });

    it('should handle pagination', async () => {
      mockRepo.count.mockResolvedValue(50);
      mockRepo.findAll.mockResolvedValue([mockBuilding]);
      const result = await buildingService.getAllBuildings({
        limit: 5,
        offset: 10,
      });
      expect(result.pagination).toEqual({
        total: 50,
        limit: 5,
        offset: 10,
        hasMore: true,
      });
    });

    it('should sort by field', async () => {
      mockRepo.count.mockResolvedValue(1);
      mockRepo.findAll.mockResolvedValue([mockBuilding]);
      await buildingService.getAllBuildings({
        sortBy: 'buildingName',
        sortOrder: 'desc',
      });
      expect(mockRepo.findAll).toHaveBeenCalledWith(
        undefined,
        { buildingName: 'desc' },
        10,
        0,
      );
    });

    it('should validate limit max 100', async () => {
      mockRepo.count.mockResolvedValue(0);
      mockRepo.findAll.mockResolvedValue([]);
      const result = await buildingService.getAllBuildings({ limit: 200 });
      expect(result.pagination.limit).toBe(10);
    });

    it('should validate offset min 0', async () => {
      mockRepo.count.mockResolvedValue(0);
      mockRepo.findAll.mockResolvedValue([]);
      const result = await buildingService.getAllBuildings({ offset: -5 });
      expect(result.pagination.offset).toBe(0);
    });
  });

  describe('updateBuilding', () => {
    it('should update building', async () => {
      mockRepo.findById.mockResolvedValue(mockBuilding);
      mockRepo.update.mockResolvedValue({
        ...mockBuilding,
        buildingName: 'Updated',
      });
      const result = await buildingService.updateBuilding('1', {
        buildingName: 'Updated',
      });
      expect(result.updateBuilding.buildingName).toBe('Updated');
    });

    it('should throw error if id empty', async () => {
      await expect(
        buildingService.updateBuilding('', { buildingName: 'Updated' }),
      ).rejects.toThrow('Building ID is required!');
    });

    it('should throw error if building not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(
        buildingService.updateBuilding('999', { buildingName: 'Updated' }),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteBuilding', () => {
    it('should delete building', async () => {
      mockRepo.findById.mockResolvedValue(mockBuilding);
      mockRepo.delete.mockResolvedValue(mockBuilding);
      const result = await buildingService.deleteBuilding('1');
      expect(result.message).toBe('Building delete successfully!');
    });

    it('should throw error if id empty', async () => {
      await expect(buildingService.deleteBuilding('')).rejects.toThrow(
        'Building ID is required!!',
      );
    });

    it('should throw error if building not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(buildingService.deleteBuilding('999')).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});

import { BuildingService } from '../building.service';
import { IBuildingRepository } from '../../interface/building.repository.interface';
import { IManagerRepository } from '../../interface/manager.repository.interface';
import { BadRequestError, NotFoundError } from '../../core/error.response';

describe('BuildingService', () => {
  let buildingService: BuildingService;
  let mockRepo: jest.Mocked<IBuildingRepository>;
  let mockManagerRepo: jest.Mocked<IManagerRepository>;

  const mockBuilding = {
    id: 'b-001',
    buildingName: 'Building A',
    address: '123 Main Street',
    campus: 'Main Campus',
    latitude: 10.7756587,
    longitude: 106.7018649,
    managerId: 'mgr-001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockManager = {
    id: 'mgr-001',
    name: 'Manager A',
    email: 'manager@example.com',
    phoneNumber: null,
    role: 'MANAGER' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockManagerRepo = {
      findById: jest.fn().mockResolvedValue(mockManager),
      findByUserIdentity: jest.fn(),
      createFromUser: jest.fn(),
    };
    buildingService = new BuildingService(mockRepo, mockManagerRepo);
  });

  describe('createBuilding()', () => {
    const validData = {
      buildingName: 'Building A',
      address: '123 Main Street',
      campus: 'Main Campus',
      managerId: 'mgr-001',
      latitude: 10.7756587,
      longitude: 106.7018649,
    };

    describe('Validation', () => {
      it('should throw BadRequestError if buildingName is missing', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            buildingName: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            buildingName: '',
          }),
        ).rejects.toThrow('Building name is required');
      });

      it('should throw BadRequestError if buildingName is only whitespace', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            buildingName: '   ',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            buildingName: '   ',
          }),
        ).rejects.toThrow('Building name is required');
      });

      it('should throw BadRequestError if address is missing', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            address: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            address: '',
          }),
        ).rejects.toThrow('Address is required');
      });

      it('should throw BadRequestError if address is only whitespace', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            address: '   ',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            address: '   ',
          }),
        ).rejects.toThrow('Address is required');
      });

      it('should throw BadRequestError if campus is missing', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            campus: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            campus: '',
          }),
        ).rejects.toThrow('Campus is required');
      });

      it('should throw BadRequestError if campus is only whitespace', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            campus: '   ',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            campus: '   ',
          }),
        ).rejects.toThrow('Campus is required');
      });

      it('should throw BadRequestError if managerId is missing', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            managerId: '',
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            managerId: '',
          }),
        ).rejects.toThrow('Manager ID is required');
      });

      it('should throw NotFoundError if manager does not exist', async () => {
        mockManagerRepo.findById.mockResolvedValue(null);

        await expect(buildingService.createBuilding(validData)).rejects.toThrow(
          NotFoundError,
        );

        await expect(buildingService.createBuilding(validData)).rejects.toThrow(
          'Manager not found',
        );
      });
    });

    describe('Latitude Validation', () => {
      it('should throw BadRequestError if latitude is less than -90', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            latitude: -91,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            latitude: -91,
          }),
        ).rejects.toThrow('Latitude must be between -90 and 90');
      });

      it('should throw BadRequestError if latitude is greater than 90', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            latitude: 91,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            latitude: 91,
          }),
        ).rejects.toThrow('Latitude must be between -90 and 90');
      });

      it('should accept valid latitude at boundaries', async () => {
        mockRepo.create.mockResolvedValue(mockBuilding);

        // Test latitude = -90
        await buildingService.createBuilding({
          ...validData,
          latitude: -90,
        });

        // Test latitude = 90
        await buildingService.createBuilding({
          ...validData,
          latitude: 90,
        });

        expect(mockRepo.create).toHaveBeenCalledTimes(2);
      });
    });

    describe('Longitude Validation', () => {
      it('should throw BadRequestError if longitude is less than -180', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            longitude: -181,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            longitude: -181,
          }),
        ).rejects.toThrow('Longitude must be between -180 and 180');
      });

      it('should throw BadRequestError if longitude is greater than 180', async () => {
        await expect(
          buildingService.createBuilding({
            ...validData,
            longitude: 181,
          }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.createBuilding({
            ...validData,
            longitude: 181,
          }),
        ).rejects.toThrow('Longitude must be between -180 and 180');
      });

      it('should accept valid longitude at boundaries', async () => {
        mockRepo.create.mockResolvedValue(mockBuilding);

        // Test longitude = -180
        await buildingService.createBuilding({
          ...validData,
          longitude: -180,
        });

        // Test longitude = 180
        await buildingService.createBuilding({
          ...validData,
          longitude: 180,
        });

        expect(mockRepo.create).toHaveBeenCalledTimes(2);
      });
    });

    describe('Success', () => {
      it('should create building successfully with all fields', async () => {
        mockRepo.create.mockResolvedValue(mockBuilding);

        const result = await buildingService.createBuilding(validData);

        expect(result).toEqual({ building: mockBuilding });
        expect(mockRepo.create).toHaveBeenCalledWith(validData);
      });

      it('should create building successfully without latitude and longitude', async () => {
        const dataWithoutCoords = {
          buildingName: 'Building B',
          address: '456 Second Street',
          campus: 'North Campus',
          managerId: 'mgr-002',
        };

        const buildingWithoutCoords = {
          ...mockBuilding,
          latitude: undefined,
          longitude: undefined,
        };

        mockRepo.create.mockResolvedValue(buildingWithoutCoords as any);

        const result = await buildingService.createBuilding(dataWithoutCoords);

        expect(result).toEqual({ building: buildingWithoutCoords });
        expect(mockRepo.create).toHaveBeenCalledWith(dataWithoutCoords);
      });
    });
  });

  describe('getBuildingById()', () => {
    it('should throw BadRequestError if id is missing', async () => {
      await expect(buildingService.getBuildingById('')).rejects.toThrow(
        BadRequestError,
      );

      await expect(buildingService.getBuildingById('')).rejects.toThrow(
        'Building ID is required',
      );
    });

    it('should throw NotFoundError if building not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        buildingService.getBuildingById('non-existent'),
      ).rejects.toThrow(NotFoundError);

      await expect(
        buildingService.getBuildingById('non-existent'),
      ).rejects.toThrow('Building not found');

      expect(mockRepo.findById).toHaveBeenCalledWith('non-existent');
    });

    it('should return building if found', async () => {
      mockRepo.findById.mockResolvedValue(mockBuilding);

      const result = await buildingService.getBuildingById('b-001');

      expect(result).toEqual({ building: mockBuilding });
      expect(mockRepo.findById).toHaveBeenCalledWith('b-001');
    });
  });

  describe('getAllBuildings()', () => {
    const mockBuildings = [mockBuilding];

    describe('Filtering', () => {
      it('should filter by search query (buildingName)', async () => {
        mockRepo.count.mockResolvedValue(1);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({ search: 'Building A' });

        expect(mockRepo.count).toHaveBeenCalledWith({
          buildingName: { contains: 'Building A', mode: 'insensitive' },
        });
      });

      it('should filter by campus', async () => {
        mockRepo.count.mockResolvedValue(1);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({ campus: 'Main Campus' });

        expect(mockRepo.count).toHaveBeenCalledWith({ campus: 'Main Campus' });
      });
    });

    describe('Sorting', () => {
      it('should sort by buildingName ascending', async () => {
        mockRepo.count.mockResolvedValue(1);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({
          sortBy: 'buildingName',
          sortOrder: 'asc',
        });

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          { buildingName: 'asc' },
          10,
          0,
        );
      });

      it('should sort by campus descending', async () => {
        mockRepo.count.mockResolvedValue(1);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({
          sortBy: 'campus',
          sortOrder: 'desc',
        });

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          { campus: 'desc' },
          10,
          0,
        );
      });

      it('should default to asc if sortOrder is invalid', async () => {
        mockRepo.count.mockResolvedValue(1);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({
          sortBy: 'createdAt',
          sortOrder: 'invalid',
        });

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          { createdAt: 'asc' },
          10,
          0,
        );
      });

      it('should ignore invalid sortBy fields', async () => {
        mockRepo.count.mockResolvedValue(1);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({ sortBy: 'invalidField' });

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10,
          0,
        );
      });
    });

    describe('Pagination', () => {
      it('should use default pagination (limit: 10, offset: 0)', async () => {
        mockRepo.count.mockResolvedValue(50);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        const result = await buildingService.getAllBuildings({});

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10,
          0,
        );
        expect(result.pagination).toEqual({
          total: 50,
          limit: 10,
          offset: 0,
          hasMore: true,
        });
      });

      it('should apply custom limit', async () => {
        mockRepo.count.mockResolvedValue(50);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({ limit: 20 });

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          20,
          0,
        );
      });

      it('should apply custom offset', async () => {
        mockRepo.count.mockResolvedValue(50);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({ offset: 10 });

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10,
          10,
        );
      });

      it('should cap limit at 100', async () => {
        mockRepo.count.mockResolvedValue(200);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        await buildingService.getAllBuildings({ limit: 150 });

        expect(mockRepo.findAll).toHaveBeenCalledWith(
          undefined,
          undefined,
          10, // Falls back to default because it exceeds 100
          0,
        );
      });

      it('should validate offset minimum is 0', async () => {
        mockRepo.count.mockResolvedValue(50);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        const result = await buildingService.getAllBuildings({ offset: -5 });

        expect(result.pagination.offset).toBe(0);
      });

      it('should calculate hasMore correctly when there are more items', async () => {
        mockRepo.count.mockResolvedValue(25);
        mockRepo.findAll.mockResolvedValue([mockBuilding]);

        const result = await buildingService.getAllBuildings({
          limit: 10,
          offset: 0,
        });

        expect(result.pagination.hasMore).toBe(true);
      });

      it('should calculate hasMore correctly when no more items', async () => {
        const mockBuildings = Array(10).fill(mockBuilding);
        mockRepo.count.mockResolvedValue(10);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        const result = await buildingService.getAllBuildings({
          limit: 10,
          offset: 0,
        });

        expect(result.pagination.hasMore).toBe(false);
      });
    });

    describe('Response Format', () => {
      it('should return buildings with pagination and filters', async () => {
        mockRepo.count.mockResolvedValue(1);
        mockRepo.findAll.mockResolvedValue(mockBuildings);

        const result = await buildingService.getAllBuildings({
          search: 'Building A',
          campus: 'Main Campus',
          limit: 10,
          offset: 0,
        });

        expect(result).toEqual({
          buildings: mockBuildings,
          pagination: {
            total: 1,
            limit: 10,
            offset: 0,
            hasMore: false,
          },
          filters: {
            search: 'Building A',
            campus: 'Main Campus',
            sortBy: null,
            sortOrder: null,
          },
        });
      });
    });
  });

  describe('updateBuilding()', () => {
    const updateData = {
      buildingName: 'Building A Updated',
      address: '456 New Street',
      campus: 'North Campus',
      managerId: 'mgr-002',
      latitude: 11.5,
      longitude: 107.5,
    };

    describe('Validation', () => {
      it('should throw BadRequestError if id is missing', async () => {
        await expect(
          buildingService.updateBuilding('', updateData),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('', updateData),
        ).rejects.toThrow('Building ID is required');
      });

      it('should throw NotFoundError if building not found', async () => {
        mockRepo.findById.mockResolvedValue(null);

        await expect(
          buildingService.updateBuilding('non-existent', updateData),
        ).rejects.toThrow(NotFoundError);

        await expect(
          buildingService.updateBuilding('non-existent', updateData),
        ).rejects.toThrow('Building not found');

        expect(mockRepo.findById).toHaveBeenCalledWith('non-existent');
      });

      it('should throw BadRequestError if buildingName is empty string', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { buildingName: '' }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { buildingName: '' }),
        ).rejects.toThrow('Building name cannot be empty');
      });

      it('should throw BadRequestError if buildingName is only whitespace', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { buildingName: '   ' }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { buildingName: '   ' }),
        ).rejects.toThrow('Building name cannot be empty');
      });

      it('should throw BadRequestError if address is empty string', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { address: '' }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { address: '' }),
        ).rejects.toThrow('Address cannot be empty');
      });

      it('should throw BadRequestError if address is only whitespace', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { address: '   ' }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { address: '   ' }),
        ).rejects.toThrow('Address cannot be empty');
      });

      it('should throw BadRequestError if campus is empty string', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { campus: '' }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { campus: '' }),
        ).rejects.toThrow('Campus cannot be empty');
      });

      it('should throw BadRequestError if campus is only whitespace', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { campus: '   ' }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { campus: '   ' }),
        ).rejects.toThrow('Campus cannot be empty');
      });

      it('should throw BadRequestError if latitude is less than -90', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { latitude: -91 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { latitude: -91 }),
        ).rejects.toThrow('Latitude must be between -90 and 90');
      });

      it('should throw BadRequestError if latitude is greater than 90', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { latitude: 91 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { latitude: 91 }),
        ).rejects.toThrow('Latitude must be between -90 and 90');
      });

      it('should throw BadRequestError if longitude is less than -180', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { longitude: -181 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { longitude: -181 }),
        ).rejects.toThrow('Longitude must be between -180 and 180');
      });

      it('should throw BadRequestError if longitude is greater than 180', async () => {
        mockRepo.findById.mockResolvedValue(mockBuilding);

        await expect(
          buildingService.updateBuilding('b-001', { longitude: 181 }),
        ).rejects.toThrow(BadRequestError);

        await expect(
          buildingService.updateBuilding('b-001', { longitude: 181 }),
        ).rejects.toThrow('Longitude must be between -180 and 180');
      });
    });

    describe('Success', () => {
      it('should update building successfully with all fields', async () => {
        const updatedBuilding = { ...mockBuilding, ...updateData };
        mockRepo.findById.mockResolvedValue(mockBuilding);
        mockRepo.update.mockResolvedValue(updatedBuilding);

        const result = await buildingService.updateBuilding(
          'b-001',
          updateData,
        );

        expect(result).toEqual({ building: updatedBuilding });
        expect(mockRepo.update).toHaveBeenCalledWith('b-001', updateData);
      });

      it('should update building successfully with partial fields', async () => {
        const partialUpdate = {
          buildingName: 'New Name',
          campus: 'New Campus',
        };
        const updatedBuilding = { ...mockBuilding, ...partialUpdate };
        mockRepo.findById.mockResolvedValue(mockBuilding);
        mockRepo.update.mockResolvedValue(updatedBuilding);

        const result = await buildingService.updateBuilding(
          'b-001',
          partialUpdate,
        );

        expect(result).toEqual({ building: updatedBuilding });
        expect(mockRepo.update).toHaveBeenCalledWith('b-001', partialUpdate);
      });

      it('should update coordinates only', async () => {
        const coordsUpdate = { latitude: 11.5, longitude: 107.5 };
        const updatedBuilding = { ...mockBuilding, ...coordsUpdate };
        mockRepo.findById.mockResolvedValue(mockBuilding);
        mockRepo.update.mockResolvedValue(updatedBuilding);

        const result = await buildingService.updateBuilding(
          'b-001',
          coordsUpdate,
        );

        expect(result.building.latitude).toBe(11.5);
        expect(result.building.longitude).toBe(107.5);
        expect(mockRepo.update).toHaveBeenCalledWith('b-001', coordsUpdate);
      });
    });
  });

  describe('deleteBuilding()', () => {
    it('should throw BadRequestError if id is missing', async () => {
      await expect(buildingService.deleteBuilding('')).rejects.toThrow(
        BadRequestError,
      );

      await expect(buildingService.deleteBuilding('')).rejects.toThrow(
        'Building ID is required',
      );
    });

    it('should throw NotFoundError if building not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        buildingService.deleteBuilding('non-existent'),
      ).rejects.toThrow(NotFoundError);

      await expect(
        buildingService.deleteBuilding('non-existent'),
      ).rejects.toThrow('Building not found');

      expect(mockRepo.findById).toHaveBeenCalledWith('non-existent');
    });

    it('should delete building successfully', async () => {
      mockRepo.findById.mockResolvedValue(mockBuilding);
      mockRepo.delete.mockResolvedValue(mockBuilding);

      const result = await buildingService.deleteBuilding('b-001');

      expect(result).toEqual({ building: mockBuilding });
      expect(mockRepo.delete).toHaveBeenCalledWith('b-001');
    });
  });
});

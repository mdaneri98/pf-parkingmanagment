package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.Vehicle;
import ar.edu.itba.parkingmanagmentapi.repository.UserRepository;
import ar.edu.itba.parkingmanagmentapi.repository.UserVehicleAssignmentRepository;
import ar.edu.itba.parkingmanagmentapi.repository.VehicleRepository;
import ar.edu.itba.parkingmanagmentapi.util.VehicleMapper;
import ar.edu.itba.parkingmanagmentapi.validators.CreateVehicleValidator;
import ar.edu.itba.parkingmanagmentapi.validators.UpdateVehicleValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final UserVehicleAssignmentRepository userVehicleAssignmentRepository;

    private final UserRepository userRepository;

    private final CreateVehicleValidator createVehicleValidator;

    private final UpdateVehicleValidator updateVehicleValidator;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, UserVehicleAssignmentRepository userVehicleAssignmentRepository, UserRepository userRepository, CreateVehicleValidator createVehicleValidator, UpdateVehicleValidator updateVehicleValidator) {
        this.vehicleRepository = vehicleRepository;
        this.userVehicleAssignmentRepository = userVehicleAssignmentRepository;
        this.userRepository = userRepository;
        this.createVehicleValidator = createVehicleValidator;
        this.updateVehicleValidator = updateVehicleValidator;
    }

    @Override
    public VehicleResponse create(VehicleRequest request) {
        createVehicleValidator.validate(request);
        Vehicle vehicle = VehicleMapper.toEntity(request);

        Optional<UserVehicleAssignment> uva = userVehicleAssignmentRepository.findByUserIdAndVehicleLicensePlate(request.getUserId(), request.getLicensePlate());
        if (uva.isPresent()) {
            throw new BadRequestException("vehicle.already.exists", request.getLicensePlate());
        }

        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new NotFoundException("user.not.found"));

        UserVehicleAssignment assignment = new UserVehicleAssignment(user, vehicle);
        vehicle.getUserAssignments().add(assignment);

        return VehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }


    @Override
    public VehicleResponse findByLicensePlate(String licensePlate) {
        return vehicleRepository.findById(licensePlate)
                .map(VehicleMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("vehicle.not.found", licensePlate));
    }

    @Override
    public List<VehicleResponse> findAllVehiclesByUser(Long id) {
        List<Vehicle> vehicles = vehicleRepository.findAllByUserId(id);
        return vehicles.stream()
                .map(VehicleMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public VehicleResponse update(String licensePlate, VehicleRequest request) {
        updateVehicleValidator.validate(request);
        Vehicle vehicle = vehicleRepository.findById(licensePlate)
                .orElseThrow(() -> new NotFoundException("vehicle.not.found", licensePlate));

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setType(request.getType());

        return VehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Override
    public void delete(String licensePlate) {
        if (!vehicleRepository.existsById(licensePlate)) {
            throw new NotFoundException("vehicle.not.found", licensePlate);
        }
        vehicleRepository.deleteById(licensePlate);
    }

    public boolean isUserOwnerOfVehicle(Long userId, String licensePlate) {
        return vehicleRepository.findById(licensePlate)
                .map(vehicle -> vehicle.getUserAssignments().stream()
                        .anyMatch(assignment -> assignment.getUser().getId().equals(userId)))
                .orElse(false);
    }

    @Override
    public Vehicle findEntityByLicensePlate(String licensePlate) {
        return vehicleRepository.findById(licensePlate)
                .orElseThrow(() -> new NotFoundException("vehicle.not.found", licensePlate));
    }

    @Override
    public Vehicle findEntityByLicensePlateOrCreate(Vehicle vehicle) {
        if (vehicle == null || vehicle.getLicensePlate() == null) {
            throw new IllegalArgumentException("Neither vehicle nor license plate can be null");
        }

        return vehicleRepository.findById(vehicle.getLicensePlate())
                .orElseGet(() -> vehicleRepository.save(vehicle));
    }

}

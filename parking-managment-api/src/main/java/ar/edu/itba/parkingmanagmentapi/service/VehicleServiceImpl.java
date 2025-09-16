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
import ar.edu.itba.parkingmanagmentapi.security.service.SecurityService;
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

    private final SecurityService securityService;

    private final UserVehicleAssignmentRepository userVehicleAssignmentRepository;

    private final UserRepository userRepository;

    private final CreateVehicleValidator createVehicleValidator;

    private final UpdateVehicleValidator updateVehicleValidator;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, SecurityService securityService, UserVehicleAssignmentRepository userVehicleAssignmentRepository, UserRepository userRepository, CreateVehicleValidator createVehicleValidator, UpdateVehicleValidator updateVehicleValidator) {
        this.vehicleRepository = vehicleRepository;
        this.securityService = securityService;
        this.userVehicleAssignmentRepository = userVehicleAssignmentRepository;
        this.userRepository = userRepository;
        this.createVehicleValidator = createVehicleValidator;
        this.updateVehicleValidator = updateVehicleValidator;
    }

    @Override
    public VehicleResponse create(VehicleRequest request) {
        createVehicleValidator.validate(request);
        if (vehicleRepository.existsById(request.getLicensePlate())) {
            throw new BadRequestException("Already exists a vehicle with license plate " + request.getLicensePlate());
        }

        Vehicle vehicle = VehicleMapper.toEntity(request);

        Optional<UserVehicleAssignment> uva = userVehicleAssignmentRepository.findByUserIdAndVehicleLicensePlate(request.getUserId(), request.getLicensePlate());
        if (uva.isPresent()) {
            throw new BadRequestException("There is already an assignment for user " + request.getUserId() + " and vehicle " + request.getLicensePlate());
        }

        User user = userRepository.findById(request.getUserId()).orElseThrow(() -> new NotFoundException("Not found user with id " + request.getUserId()));

        UserVehicleAssignment assignment = new UserVehicleAssignment(user, vehicle);
        vehicle.getUserAssignments().add(assignment);
        
        return VehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }


    @Override
    public VehicleResponse findByLicensePlate(String licensePlate) {
        return vehicleRepository.findById(licensePlate)
                .map(VehicleMapper::toResponse)
                .orElseThrow(() -> new NotFoundException("Not found vehicle with license plate " + licensePlate));
    }

    @Override
    public List<VehicleResponse> findAll() {
        return securityService.getCurrentUser()
                .map(user -> vehicleRepository.findByUserId(user.getId())
                        .stream()
                        .map(VehicleMapper::toResponse)
                        .toList())
                .orElse(List.of());
    }

    @Override
    @Transactional
    public VehicleResponse update(String licensePlate, VehicleRequest request) {
        updateVehicleValidator.validate(request);
        Vehicle vehicle = vehicleRepository.findById(licensePlate)
                .orElseThrow(() -> new NotFoundException("Not found vehicle with license plate " + licensePlate));

        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setType(request.getType());

        return VehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Override
    public void delete(String licensePlate) {
        if (!vehicleRepository.existsById(licensePlate)) {
            throw new NotFoundException("Not found vehicle with license plate " + licensePlate);
        }
        vehicleRepository.deleteById(licensePlate);
    }

    public boolean isUserOwnerOfVehicle(Long userId, String licensePlate) {
        return vehicleRepository.findById(licensePlate)
                .map(vehicle -> vehicle.getUserAssignments().stream()
                        .anyMatch(assignment -> assignment.getUser().getId().equals(userId)))
                .orElse(false);
    }

}

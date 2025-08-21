package ar.edu.itba.parkingmanagmentapi.service;

import ar.edu.itba.parkingmanagmentapi.dto.VehicleRequest;
import ar.edu.itba.parkingmanagmentapi.dto.VehicleResponse;
import ar.edu.itba.parkingmanagmentapi.exceptions.AuthenticationFailedException;
import ar.edu.itba.parkingmanagmentapi.exceptions.BadRequestException;
import ar.edu.itba.parkingmanagmentapi.exceptions.NotFoundException;
import ar.edu.itba.parkingmanagmentapi.model.User;
import ar.edu.itba.parkingmanagmentapi.model.UserVehicleAssignment;
import ar.edu.itba.parkingmanagmentapi.model.Vehicle;
import ar.edu.itba.parkingmanagmentapi.repository.UserVehicleAssignmentRepository;
import ar.edu.itba.parkingmanagmentapi.repository.VehicleRepository;
import ar.edu.itba.parkingmanagmentapi.security.service.SecurityService;
import ar.edu.itba.parkingmanagmentapi.util.VehicleMapper;
import ar.edu.itba.parkingmanagmentapi.validators.CreateVehicleValidator;
import ar.edu.itba.parkingmanagmentapi.validators.UpdateVehicleValidator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final SecurityService securityService;

    private final UserVehicleAssignmentRepository userVehicleAssignmentRepository;

    private final CreateVehicleValidator createVehicleValidator;

    private final UpdateVehicleValidator updateVehicleValidator;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, SecurityService securityService, UserVehicleAssignmentRepository userVehicleAssignmentRepository, CreateVehicleValidator createVehicleValidator, UpdateVehicleValidator updateVehicleValidator) {
        this.vehicleRepository = vehicleRepository;
        this.securityService = securityService;
        this.userVehicleAssignmentRepository = userVehicleAssignmentRepository;
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
        vehicleRepository.save(vehicle);

        User currentUser = securityService.getCurrentUser()
                .orElseThrow(() -> new AuthenticationFailedException("User no authenticated to create vehicle"));

        UserVehicleAssignment assignment = new UserVehicleAssignment();
        assignment.setUser(currentUser);
        assignment.setVehicle(vehicle);

        userVehicleAssignmentRepository.save(assignment);

        return VehicleMapper.toResponse(vehicle);
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

import React from 'react';
import { useParams } from 'react-router-dom';

const ParkingLotDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Parking Lot Details
        </h1>
        <div className="space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Edit
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500 text-center py-8">
          Parking lot details for ID: {id} will be implemented here
        </p>
      </div>
    </div>
  );
};

export default ParkingLotDetails;

import React from 'react';

const Authentication: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Authentication
          </h1>
          <p className="mt-2 text-gray-600">
            Login or register to access the parking management system
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-500 text-center">
            Authentication form will be implemented here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;


interface DashboardHeaderProps {
  lotName: string;
}

export function DashboardHeader({ 
  lotName
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="space-y-2">
        <h1 className="page-title">
          {lotName}
        </h1>
      </div>
    </div>
  );
}
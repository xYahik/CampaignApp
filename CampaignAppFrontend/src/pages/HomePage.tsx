import { CampaignListTable } from "@/components/ui/campaign/CampaignListTable";

function HomePage() {
  return (
    <div className="flex justify-center h-full">
      <div className="w-600 flex flex-col gap-8 ">
        <h1 className="text-2xl font-bold">
          <CampaignListTable />
        </h1>
      </div>
    </div>
  );
}

export default HomePage;

import CreateCampaignForm from "@/components/ui/campaign/CreateCampaignForm";

function CampaignCreatePage() {
  return (
    <div className="flex justify-center h-full">
      <div className="flex flex-col gap-8 w-full">
        <h1 className="text-2xl font-bold">
          <CreateCampaignForm />
        </h1>
      </div>
    </div>
  );
}

export default CampaignCreatePage;

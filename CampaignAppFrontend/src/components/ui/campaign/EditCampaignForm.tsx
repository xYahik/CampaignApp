import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import { Card, CardContent } from "../card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { useNavigate, useParams } from "react-router";
import { api } from "@/api";
import { useEffect } from "react";
import { useAuth } from "../AuthProvider";

const keywordsList: Option[] = [
  { label: "Food", value: "Food" },
  { label: "Clothes", value: "Clothes" },
  { label: "Music", value: "Music" },
  { label: "Mix", value: "Mix" },
];
const cities = [
  { label: "Warsaw", value: "warsaw" },
  { label: "Krakow", value: "krakow" },
  { label: "Lodz", value: "lodz" },
  { label: "Wroclaw", value: "wroclaw" },
  { label: "Poznan", value: "poznan" },
  { label: "Gdansk", value: "gdansk" },
  { label: " Szczecin", value: "szczecin" },
  { label: "Bydgoszcz", value: "bydgoszcz" },
  { label: "Lublin", value: "lublin" },
  { label: "Katowice", value: "katowice" },
] as const;

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});

const FormSchema = z.object({
  campaignName: z.string().min(1),
  campaignKeywords: z.array(optionSchema).min(1),
  campaignBidAmount: z.coerce.number().min(0),
  campaignFund: z.coerce.number().min(0),
  campaignStatus: z.string().min(1),
  campaignTown: z.string().min(1),
  campaignRadius: z.coerce.number().min(0),
});

const CreateCampaignForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { refreshUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const result = await handleUpdateCampaign(data);

    if (result) {
      toast.success("The campaign was updated");
      navigate("/campaign/my", { replace: true });
    }
  };

  async function handleUpdateCampaign(data: any) {
    try {
      const keywordList = data.campaignKeywords.map(
        (keyword: Option) => keyword.value
      );
      let payload: any = {
        name: data.campaignName,
        keywords: keywordList,
        bidAmount: data.campaignBidAmount,
        campaignFund: data.campaignFund,
        status: data.campaignStatus,
        town: data.campaignTown,
        radius: data.campaignRadius,
      };
      await api.put(`/campaign/${id}`, payload);
      await refreshUser();
      return true;
    } catch (e: any) {
      toast.error(e.response.data);
    }

    return false;
  }

  useEffect(() => {
    form.setValue("campaignStatus", "ON");
  }, [form]);
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get(`/campaign/${id}`);
        console.log(response.data);
        form.setValue("campaignName", response.data.name);
        const keywordList = response.data.keywords.map((keyword: String) => ({
          label: keyword,
          value: keyword,
        }));
        form.setValue("campaignKeywords", keywordList);
        form.setValue("campaignBidAmount", response.data.bidAmount);
        form.setValue("campaignFund", response.data.campaignFund);
        form.setValue("campaignStatus", response.data.status);
        form.setValue("campaignTown", response.data.town);
        form.setValue("campaignRadius", response.data.radius);

        //setData(response.data);
      } catch (e: any) {
        toast.error(e.response.data);
      }
    };

    fetchCampaigns();
  }, []);
  return (
    <Card className="w-full max-w-[600px] mx-auto">
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-[550px] space-y-6"
          >
            <FormField
              control={form.control}
              name="campaignName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="New Campaign Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignKeywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywods</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      defaultOptions={keywordsList}
                      placeholder="Select keywords that describe campaign"
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          no results found.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignBidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BidAmount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignFund"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Fund</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue="ON"
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ON">ON</SelectItem>
                      <SelectItem value="OFF">OFF</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campaignTown"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Town</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? cities.find((city) => city.value === field.value)
                                ?.label
                            : "Select town"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search town..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {cities.map((city) => (
                              <CommandItem
                                value={city.label}
                                key={city.value}
                                onSelect={() => {
                                  form.setValue("campaignTown", city.value);
                                }}
                              >
                                {city.label}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    city.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="campaignRadius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Radius (km)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0 (km)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
export default CreateCampaignForm;

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackTicketList } from "@/components/admin/FeedbackTicketList";
import { FeedbackTicketDetail } from "@/components/admin/FeedbackTicketDetail";
import { FeedbackConfigPanel } from "@/components/admin/FeedbackConfigPanel";
import { getFeedbackList } from "@/services/feedbackService";
import type { FeedbackItem, FeedbackCategory, FeedbackStatus } from "@/types";

const AdminFeedback = () => {
  const { profile, isLoading: authLoading } = useAuthContext();
  const navigate = useNavigate();

  const [tickets, setTickets] = useState<FeedbackItem[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<FeedbackItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<FeedbackCategory | "">("");
  const [filterStatus, setFilterStatus] = useState<FeedbackStatus | "">("");

  useEffect(() => {
    if (!authLoading && !profile?.is_admin) {
      navigate("/");
    }
  }, [authLoading, profile, navigate]);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFeedbackList({
        category: filterCategory || undefined,
        status: filterStatus || undefined,
      });
      setTickets(data);
    } catch {
      // Fehler werden im Service behandelt
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterStatus]);

  useEffect(() => {
    if (profile?.is_admin) loadTickets();
  }, [profile, loadTickets]);

  const handleTicketUpdated = useCallback(() => {
    loadTickets();
    setSelectedTicket(null);
  }, [loadTickets]);

  if (authLoading) return null;
  if (!profile?.is_admin) return null;

  return (
    <div className="space-y-6">
      <h1 className="page-title">Feedback</h1>

      <Tabs defaultValue="tickets">
        <TabsList>
          <TabsTrigger value="tickets">Tickets ({tickets.length})</TabsTrigger>
          <TabsTrigger value="config">Einstellungen</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-4">
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <FeedbackTicketList
                tickets={tickets}
                loading={loading}
                selectedId={selectedTicket?.id}
                filterCategory={filterCategory}
                filterStatus={filterStatus}
                onFilterCategory={setFilterCategory}
                onFilterStatus={setFilterStatus}
                onSelect={setSelectedTicket}
              />
            </div>
          </div>
          <FeedbackTicketDetail
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onUpdated={handleTicketUpdated}
          />
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <FeedbackConfigPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeedback;

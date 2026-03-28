import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

export default function UserProfileMenu() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser({ email: session.user.email });

      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", session.user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null);
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  if (!user) {
    return (
      <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="gap-2">
        <User className="w-4 h-4" /> Sign In
      </Button>
    );
  }

  const initials = (profile?.display_name || user.email || "U").slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
        <AvatarFallback className="text-xs bg-primary/20 text-primary">{initials}</AvatarFallback>
      </Avatar>
      <div className="hidden md:block">
        <p className="text-sm font-medium leading-none">{profile?.display_name || "User"}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
      <Button size="icon" variant="ghost" onClick={handleLogout} className="h-7 w-7">
        <LogOut className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

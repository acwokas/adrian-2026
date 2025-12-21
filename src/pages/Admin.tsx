import { useState, useEffect } from "react";
import { Upload, FileText, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Admin() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentCvPath, setCurrentCvPath] = useState<string | null>(null);
  const [storedPasswordHash, setStoredPasswordHash] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("cv_path, admin_password_hash")
      .eq("id", "main")
      .single();

    if (data) {
      setCurrentCvPath(data.cv_path);
      setStoredPasswordHash(data.admin_password_hash);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password === storedPasswordHash) {
      setIsAuthenticated(true);
      toast({ title: "Logged in successfully" });
    } else {
      toast({ title: "Invalid password", variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Please upload a PDF file", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      const fileName = `adrian-watkins-cv-${Date.now()}.pdf`;
      
      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Update settings with new CV path
      const { error: updateError } = await supabase
        .from("site_settings")
        .update({ cv_path: fileName, updated_at: new Date().toISOString() })
        .eq("id", "main");

      if (updateError) throw updateError;

      setCurrentCvPath(fileName);
      toast({ title: "CV uploaded successfully" });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const getCvUrl = () => {
    if (!currentCvPath) return null;
    const { data } = supabase.storage.from("documents").getPublicUrl(currentCvPath);
    return data.publicUrl;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-medium">Admin Access</h1>
            <p className="text-muted-foreground text-sm">Enter your password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-card border-border/50"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : "Login"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium">Admin</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>

        <div className="space-y-6 p-6 border border-border/50 rounded-lg bg-card">
          <div className="space-y-2">
            <h2 className="text-xl">CV Document</h2>
            <p className="text-sm text-muted-foreground">
              Upload your CV PDF. This will be available for download on the Resume page.
            </p>
          </div>

          {currentCvPath && (
            <div className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border/30">
              <FileText size={20} className="text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Current CV</p>
                <a 
                  href={getCvUrl() || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  {currentCvPath}
                </a>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="cv-upload">Upload new CV</Label>
            <div className="flex gap-3">
              <Input
                id="cv-upload"
                type="file"
                accept=".pdf"
                onChange={handleCvUpload}
                disabled={isUploading}
                className="bg-background border-border/50"
              />
            </div>
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="animate-spin" size={14} />
                Uploading...
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 p-6 border border-border/50 rounded-lg bg-card">
          <div className="space-y-2">
            <h2 className="text-xl">Change Password</h2>
            <p className="text-sm text-muted-foreground">
              Update your admin password for security.
            </p>
          </div>
          <ChangePassword currentPassword={storedPasswordHash} onUpdate={fetchSettings} />
        </div>
      </div>
    </div>
  );
}

function ChangePassword({ currentPassword, onUpdate }: { currentPassword: string | null; onUpdate: () => void }) {
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (oldPassword !== currentPassword) {
      toast({ title: "Current password is incorrect", variant: "destructive" });
      return;
    }

    if (newPassword.length < 8) {
      toast({ title: "New password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setIsUpdating(true);
    
    const { error } = await supabase
      .from("site_settings")
      .update({ admin_password_hash: newPassword })
      .eq("id", "main");

    if (error) {
      toast({ title: "Failed to update password", variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully" });
      setOldPassword("");
      setNewPassword("");
      onUpdate();
    }
    
    setIsUpdating(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="old-password">Current password</Label>
        <Input
          id="old-password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="bg-background border-border/50"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className="bg-background border-border/50"
        />
      </div>
      <Button type="submit" disabled={isUpdating}>
        {isUpdating ? <Loader2 className="animate-spin" size={16} /> : "Update Password"}
      </Button>
    </form>
  );
}

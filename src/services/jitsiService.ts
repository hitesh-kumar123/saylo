// Jitsi Meet service to replace Daily.co
export interface JitsiConfig {
  roomName: string;
  domain: string;
  width: number;
  height: number;
  parentNode: HTMLElement;
  userInfo?: {
    displayName?: string;
    email?: string;
  };
  configOverwrite?: Record<string, any>;
  interfaceConfigOverwrite?: Record<string, any>;
}

export interface JitsiMeetAPI {
  executeCommand: (command: string, ...args: any[]) => void;
  dispose: () => void;
  addListener: (event: string, listener: (...args: any[]) => void) => void;
  removeListener: (event: string, listener: (...args: any[]) => void) => void;
  isAudioMuted: () => boolean;
  isVideoMuted: () => boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  getParticipantsInfo: () => any[];
}

export class JitsiService {
  private api: JitsiMeetAPI | null = null;
  private roomName: string = "";
  private domain: string = "meet.jit.si"; // Default Jitsi domain

  constructor(domain?: string) {
    if (domain) {
      this.domain = domain;
    }
  }

  // Initialize Jitsi Meet
  async initializeJitsi(config: JitsiConfig): Promise<JitsiMeetAPI> {
    return new Promise((resolve, reject) => {
      // Load Jitsi Meet API script if not already loaded
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.onload = () => {
          this.createJitsiRoom(config, resolve, reject);
        };
        script.onerror = () => {
          reject(new Error("Failed to load Jitsi Meet API"));
        };
        document.head.appendChild(script);
      } else {
        this.createJitsiRoom(config, resolve, reject);
      }
    });
  }

  private createJitsiRoom(
    config: JitsiConfig,
    resolve: (api: JitsiMeetAPI) => void,
    reject: (error: Error) => void
  ) {
    try {
      const jitsiConfig = {
        roomName: config.roomName,
        width: config.width,
        height: config.height,
        parentNode: config.parentNode,
        userInfo: config.userInfo,
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
          ...config.configOverwrite,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "closedcaptions",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "profile",
            "chat",
            "recording",
            "livestreaming",
            "etherpad",
            "sharedvideo",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "feedback",
            "stats",
            "shortcuts",
            "tileview",
            "videobackgroundblur",
            "download",
            "help",
            "mute-everyone",
            "e2ee",
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_POWERED_BY: false,
          ...config.interfaceConfigOverwrite,
        },
      };

      this.api = new window.JitsiMeetExternalAPI(this.domain, jitsiConfig);
      this.roomName = config.roomName;

      // Set up event listeners
      this.api.addListener("videoConferenceJoined", () => {
        console.log("Joined video conference");
      });

      this.api.addListener("videoConferenceLeft", () => {
        console.log("Left video conference");
      });

      this.api.addListener("participantJoined", (participant: any) => {
        console.log("Participant joined:", participant);
      });

      this.api.addListener("participantLeft", (participant: any) => {
        console.log("Participant left:", participant);
      });

      this.api.addListener("readyToClose", () => {
        console.log("Ready to close");
        this.dispose();
      });

      resolve(this.api);
    } catch (error) {
      reject(new Error(`Failed to create Jitsi room: ${error}`));
    }
  }

  // Generate a unique room name
  generateRoomName(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `saylo-interview-${timestamp}-${random}`;
  }

  // Join a room
  async joinRoom(
    roomName: string,
    userInfo?: { displayName?: string; email?: string }
  ): Promise<JitsiMeetAPI> {
    const config: JitsiConfig = {
      roomName,
      domain: this.domain,
      width: 800,
      height: 600,
      parentNode: document.getElementById("jitsi-container") || document.body,
      userInfo,
    };

    return this.initializeJitsi(config);
  }

  // Audio controls
  toggleAudio(): void {
    if (this.api) {
      this.api.executeCommand("toggleAudio");
    }
  }

  toggleVideo(): void {
    if (this.api) {
      this.api.executeCommand("toggleVideo");
    }
  }

  isAudioMuted(): boolean {
    return this.api ? this.api.isAudioMuted() : false;
  }

  isVideoMuted(): boolean {
    return this.api ? this.api.isVideoMuted() : false;
  }

  // Screen sharing
  toggleScreenShare(): void {
    if (this.api) {
      this.api.executeCommand("toggleShareScreen");
    }
  }

  // Chat
  sendMessage(message: string): void {
    if (this.api) {
      this.api.executeCommand("sendChatMessage", message);
    }
  }

  // Recording
  startRecording(): void {
    if (this.api) {
      this.api.executeCommand("toggleRecording");
    }
  }

  // Get participants
  getParticipants(): any[] {
    return this.api ? this.api.getParticipantsInfo() : [];
  }

  // Leave room
  leaveRoom(): void {
    if (this.api) {
      this.api.executeCommand("hangup");
    }
  }

  // Dispose of the API
  dispose(): void {
    if (this.api) {
      this.api.dispose();
      this.api = null;
    }
  }

  // Get current room name
  getRoomName(): string {
    return this.roomName;
  }

  // Check if API is ready
  isReady(): boolean {
    return this.api !== null;
  }
}

// Global Jitsi service instance
export const jitsiService = new JitsiService();

// Extend Window interface for Jitsi Meet
declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: any) => JitsiMeetAPI;
  }
}

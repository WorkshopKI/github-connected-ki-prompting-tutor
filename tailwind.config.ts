import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			// Design-System KI-Werkstatt: semantische Farben (Werte in src/index.css)
  			brand: {
  				ink: 'hsl(var(--brand-ink))',
  				soft: 'hsl(var(--brand-soft))',
  				'soft-ink': 'hsl(var(--brand-soft-ink))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				soft: 'hsl(var(--success-soft))'
  			},
  			warning: {
  				DEFAULT: 'hsl(var(--warning))',
  				soft: 'hsl(var(--warning-soft))'
  			},
  			danger: {
  				DEFAULT: 'hsl(var(--destructive))',
  				soft: 'hsl(var(--danger-soft))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				soft: 'hsl(var(--info-soft))'
  			},
  			confidential: {
  				DEFAULT: 'hsl(var(--conf-confidential))',
  				foreground: 'hsl(var(--on-conf-confidential))'
  			},
  			'ink-subtle': 'hsl(var(--ink-subtle))',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				muted: 'hsl(var(--sidebar-muted))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				hover: 'hsl(var(--sidebar-hover))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		backgroundImage: {
  			'gradient-primary': 'var(--gradient-primary)',
  			'gradient-subtle': 'var(--gradient-subtle)',
  			'gradient-card': 'var(--gradient-card)'
  		},
  		boxShadow: {
  			xs: 'var(--shadow-xs)',
  			sm: 'var(--shadow-sm)',
  			md: 'var(--shadow-md)',
  			lg: 'var(--shadow-lg)',
  			glow: 'var(--shadow-glow)'
  		},
  		transitionProperty: {
  			smooth: 'var(--transition-smooth)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'fade-up': {
  				from: { opacity: '0', transform: 'translateY(16px)' },
  				to: { opacity: '1', transform: 'translateY(0)' }
  			},
  			'scale-in': {
  				from: { opacity: '0', transform: 'scale(0.5)' },
  				to: { opacity: '1', transform: 'scale(1)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-up': 'fade-up 0.18s ease-out forwards',
  			'scale-in': 'scale-in 0.2s ease-out'
  		},
  		fontFamily: {
  			// Design-System: Source Sans 3 (Oberfläche), Source Serif 4 (Seitentitel), Source Code Pro (Prompts)
  			sans: ['Source Sans 3', 'Source Sans Pro', 'Segoe UI', 'system-ui', 'sans-serif'],
  			body: ['Source Sans 3', 'Source Sans Pro', 'Segoe UI', 'system-ui', 'sans-serif'],
  			serif: ['Source Serif 4', 'Source Serif Pro', 'Georgia', 'Times New Roman', 'serif'],
  			mono: [
  				'Source Code Pro',
  				'ui-monospace',
  				'SFMono-Regular',
  				'Menlo',
  				'Monaco',
  				'Consolas',
  				'Liberation Mono',
  				'Courier New',
  				'monospace'
  			]
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

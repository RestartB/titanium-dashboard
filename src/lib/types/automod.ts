export interface AutomodSettings {
	badword_detection: AutomodFilter;
	spam_detection: AutomodFilter;
	malicious_link_detection: AutomodFilter;
	phishing_link_detection: AutomodFilter;
}

export interface AutomodFilter {
	enabled: boolean;
	rules: AutomodRule[];
}

export interface AutomodRule {
	id: string;
	rule_type: string;
	rule_name: string;
	words?: string[];
	antispam_type?: string;
	occurences: number;
	threshold: number;
	duration: number;
	actions: AutomodAction[];
}

export interface AutomodAction {
	type: string;
	duration?: number;
	reason?: string;
}

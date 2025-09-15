export interface AutomodSettings {
	badword_detection: AutomodRule[];
	spam_detection: AutomodRule[];
	malicious_link_detection: AutomodRule[];
	phishing_link_detection: AutomodRule[];
}

export interface AutomodRule {
	id: string;
	rule_type: string;
	rule_name: string;
	words?: string[];
	antispam_type?: string;
	threshold: number;
	duration: number;
	actions: AutomodAction[];
}

export interface AutomodAction {
	type: string;
	duration?: number;
	reason?: string;
}

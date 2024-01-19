import {App, FileSystemAdapter, PluginSettingTab, setIcon, Setting} from "obsidian";
import MapGpxPlugin from "../MapGpxPlugin";


export class Tab extends PluginSettingTab {
	plugin: MapGpxPlugin;

	constructor(app: App, plugin: MapGpxPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings cache" });

		new Setting(containerEl)
			.setName("Use cache")
			.setDesc("Attention! When actively using the plugin, the folder may take up a lot of disk space")
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.cache)
					.onChange(async (value) => {
						this.plugin.settings.cache = value;
						this.display()
						await this.plugin.saveSettings();
					})
			);


		if (this.plugin.settings.cache) {
			new Setting(containerEl)
				.setName("Folder cache")
				.setDesc("Attention! Use an absolute path")
				.addTextArea(text => text
					.setValue(this.plugin.settings.cacheFolder)
					.onChange(async (value) => {
						this.plugin.settings.cacheFolder = value;
						await this.plugin.saveSettings();
					})
				);
		}

		containerEl.createEl("h2", { text: "Settings box" });

		new Setting(containerEl)
			.setName("Zoom control")
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.zoomControl)
					.onChange(async (value) => {
						this.plugin.settings.zoomControl = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Color track")
			.addText(text => text
				.setValue(this.plugin.settings.color)
				.onChange(async (value) => {
					this.plugin.settings.color = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName("Height map box")
			.addText(text => text
				.setValue(this.plugin.settings.height)
				.onChange(async (value) => {
					this.plugin.settings.height = value;
					await this.plugin.saveSettings();
				})
			);


		new Setting(containerEl)
			.setName("Width map box")
			.addText(text => text
				.setValue(this.plugin.settings.width)
				.onChange(async (value) => {
					this.plugin.settings.width = value;
					await this.plugin.saveSettings();
				})
			);

		containerEl.createEl("h2", { text: "Settings tiles providers" });

		const defaultProviderOptions: Record<string, string> = {}
		Object.keys(this.plugin.settings.providers).forEach(key => {
			defaultProviderOptions[key] = key
		});

		new Setting(containerEl)
			.setName("Default tiles provider")
			.addDropdown(dropdown => dropdown
				.addOptions(defaultProviderOptions)
				.setValue(this.plugin.settings.defaultProvider)
				.onChange(async (value) =>	{
					this.plugin.settings.defaultProvider = value
					await this.plugin.saveSettings()
				})
			);

		Object.entries(this.plugin.settings.providers).forEach(([key, provider]) => {

			const providers = new Setting(containerEl).setName(key)

			if (provider.variants) {
				providers.addDropdown(dropdown => dropdown
					.addOptions(provider.variants)
					.setValue(provider.options.variant)
					.onChange(async (value) => {
						provider.options.variant = value
						await this.plugin.saveSettings()
					})
				)
			}
			providers.addToggle(toggle => toggle
				.setValue(provider.enable)
				.onChange(async (value) => {
					provider.enable = value;
					await this.plugin.saveSettings();
				})
			)
		})

		containerEl.createEl("h2", { text: "Settings icons" });

		new Setting(containerEl)
			.setName("Use custom icons")
			.addToggle(toggle =>
				toggle
					.setValue(this.plugin.settings.icon)
					.onChange(async (value) => {
						this.plugin.settings.icon = value;
						this.display()
						await this.plugin.saveSettings();
					})
			);

		if (this.plugin.settings.icon) {

			new Setting(containerEl)
				.setName("Start icon url")
				.addText(text => text
					.setValue(this.plugin.settings.startIconUrl)
					.onChange(async (value) => {
						this.plugin.settings.startIconUrl = value;
						await this.plugin.saveSettings();
					})
				);

			new Setting(containerEl)
				.setName("End icon url")
				.addText(text => text
					.setValue(this.plugin.settings.endIconUrl)
					.onChange(async (value) => {
						this.plugin.settings.endIconUrl = value;
						await this.plugin.saveSettings();
					})
				);

			new Setting(containerEl)
				.setName("WPT icon url")
				.addText(text => text
					.setValue(this.plugin.settings.wptIconUrl)
					.onChange(async (value) => {
						this.plugin.settings.wptIconUrl = value;
						await this.plugin.saveSettings();
					})
				);

			new Setting(containerEl)
				.setName("Shadow url")
				.addText(text => text
					.setValue(this.plugin.settings.shadowUrl)
					.onChange(async (value) => {
						this.plugin.settings.shadowUrl = value;
						await this.plugin.saveSettings();
					})
				);
		}
	}
}

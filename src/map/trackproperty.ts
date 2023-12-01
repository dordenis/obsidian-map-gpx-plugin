
export class TrackProperty {

	private property: object;

	constructor(property: object) {
		this.property = property;
	}

	public distance(): number {
		// @ts-ignore
		const distance = this.property.get_distance();
		return Math.round(distance / 1000);
	}

	public movingTime(): number  | null {
		// @ts-ignore
		const time = this.property.get_moving_time();
		if (time && time > 0) {
			return Math.round(time / 60000);
		}
		return null;
	}

	public movingTotal(): number  | null {
		// @ts-ignore
		const time = this.property.get_total_time();
		if (time && time > 0) {
			return Math.round(time / 60000);
		}
		return null;
	}

	public speed(): number | null {
		// @ts-ignore
		const time = this.movingTime() / 60;
		const distance = this.distance();
		if ((time > 0) && (distance > 0)) {
			return Math.round(distance / time);
		}

		return null;
	}
}

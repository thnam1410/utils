export type SerializeFormDataOptions = {
	indices?: boolean;
	nullsAsUndefined?: boolean;
	booleansAsIntegers?: boolean;
	allowEmptyArrays?: boolean;
	noFilesWithArrayNotation?: boolean;
	dotsForObjectNotation?: boolean;
};
export const serializeToFormData = (obj: any, cfg: SerializeFormDataOptions, fd?: any, pre: string = "") => {
	cfg = cfg || {};
	fd = fd || new FormData();

	cfg.indices = initCfg(cfg.indices);
	cfg.nullsAsUndefined = initCfg(cfg.nullsAsUndefined);
	cfg.booleansAsIntegers = initCfg(cfg.booleansAsIntegers);
	cfg.allowEmptyArrays = initCfg(cfg.allowEmptyArrays);
	cfg.noFilesWithArrayNotation = initCfg(cfg.noFilesWithArrayNotation);
	cfg.dotsForObjectNotation = initCfg(cfg.dotsForObjectNotation);
	if (isUndefined(obj)) {
		return fd;
	} else if (isNull(obj)) {
		if (!cfg.nullsAsUndefined) {
			fd.append(pre, "");
		}
	} else if (isBoolean(obj)) {
		if (cfg.booleansAsIntegers) {
			fd.append(pre, obj ? 1 : 0);
		} else {
			fd.append(pre, obj);
		}
	} else if (isArray(obj)) {
		if (obj.length) {
			obj.forEach((value: any, index: number) => {
				let key = pre + "[" + (cfg.indices ? index : "") + "]";

				if (cfg.noFilesWithArrayNotation && isFile(value)) {
					key = pre;
				}

				serializeToFormData(value, cfg, fd, key);
			});
		} else if (cfg.allowEmptyArrays) {
			fd.append(pre + "[]", "");
		}
	} else if (isDate(obj)) {
		fd.append(pre, obj.toISOString());
	} else if (isObject(obj) && !isBlob(obj)) {
		Object.keys(obj).forEach((prop) => {
			const value = obj[prop];

			if (isArray(value)) {
				while (prop.length > 2 && prop.lastIndexOf("[]") === prop.length - 2) {
					prop = prop.substring(0, prop.length - 2);
				}
			}

			const key = pre ? (cfg.dotsForObjectNotation ? pre + "." + prop : pre + "[" + prop + "]") : prop;

			serializeToFormData(value, cfg, fd, key);
		});
	} else {
		fd.append(pre, obj);
	}
	return fd;
};

function isUndefined(value: any) {
	return value === undefined;
}

function isNull(value: any) {
	return value === null;
}

function isBoolean(value: any) {
	return typeof value === "boolean";
}

function isObject(value: any) {
	return value === Object(value);
}

function isArray(value: any) {
	return Array.isArray(value);
}

function isDate(value: any) {
	return value instanceof Date;
}

function isBlob(value: any) {
	return (
		isObject(value) &&
		typeof value.size === "number" &&
		typeof value.type === "string" &&
		typeof value.slice === "function"
	);
}

function isFile(value: any) {
	return (
		isBlob(value) &&
		typeof value.name === "string" &&
		(isObject(value.lastModifiedDate) || typeof value.lastModified === "number")
	);
}

function initCfg(value: any) {
	return isUndefined(value) ? false : value;
}

//Usage:
serializeToFormData({ a: 1, b: 2, c: [] }, { noFilesWithArrayNotation: true });

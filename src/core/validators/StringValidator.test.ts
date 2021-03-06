/*
 * Copyright (c) 2020. This code created and belongs to Atlas render manager project.
 * Owner and project architect: Danil Andreev | danssg08@gmail.com |  https://github.com/DanilAndreev
 * Project: atlas-monitor
 * File last modified: 04.11.2020, 22:38
 * All rights reserved.
 */

import StringValidator from "./StringValidator";

describe("core/validators/StringValidator", () => {
    test("Input string number test", () => {
        const result = StringValidator("10");
        expect(result.value).toBe("10");
        expect(result.error).toBe(false);
    });

    test("Input string text test", () => {
        const result = StringValidator("Hello");
        expect(result.value).toBe("Hello");
        expect(result.error).toBe(false);
    });

    test("Input boolean test", () => {
        const result = StringValidator(true);
        expect(result.value).toBe(undefined);
        expect(result.error).toBe(true);
    });

    test("Input object test", () => {
        const result = StringValidator({text: "Hello"});
        expect(result.value).toBe(undefined);
        expect(result.error).toBe(true);
    });

    test("Input object test", () => {
        const result = StringValidator(null);
        expect(result.value).toBe(null);
        expect(result.error).toBe(false);
    });
});
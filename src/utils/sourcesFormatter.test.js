import { formatShare, formatter } from "./sourcesFormatter"

describe(formatter.name, () => {
  it("funds type-name juggling", () => expect(formatter([
    {
      "share": 0.9,
      "amount": 0.1,
      "funds": {
        "name": "a",
      }
    },
    {
      "share": 0.0996225838605934,
      "amount": 0.2,
      "funds": {
        "type": "a",
      }
    },
    {
      "share": 0.0003774161394065974,
      "amount": 0.3,
      "funds": {
        "name": "b",
        "type": "a"
      }
    }
  ], "funds.type")).toStrictEqual([
    {
      "funds": {
        "type": "a",
        "name": "a",
      },
      "amount": 0.6000000000000001,
      "share": 1,
    }
  ]))

  describe("Key is in property value", () => {
    it("Stringify is called", () => expect(formatter([
      {"prop": "1", "share": 0.1, "amount": 1, "funds": {}},
      {"prop": 1,   "share": 0.1, "amount": 1, "funds": {}},
      {"prop": [1], "share": 0.1, "amount": 1, "funds": {}},
    ], "prop")).toStrictEqual([
      {"prop": "1", "share": 0.3, "amount": 3, "funds": {"type": undefined}},
    ]))

    it("Object also has toString primitive", () => expect(formatter([
      {"prop": {"a": 1},          "amount": 1, "share": 0.1, "funds": {}},
      {"prop": {"b": 2},          "amount": 1, "share": 0.1, "funds": {}},
      {"prop": "[object Object]", "amount": 1, "share": 0.1, "funds": {}},
    ], "prop")).toStrictEqual([
      {"prop": {"a": 1},          "amount": 3, "share": 0.3, "funds": {"type": undefined}}
    ]))
  })

  describe("GLBA-526 Rounding", () => {
    /**
     * @template {{share: number}} S
     * @param {S[]} formatted
    */
    function sumShares(formatted) {
      return formatted.reduce((acc, {share}) => acc + +share, 0)
    }

    it("GLBA-526 Rounding", () => {
      const formatted = formatter([{
        "share": 0.9996225838605934,
        "amount": 1,
        "funds": {"type": "a",}
      }, {
        "share": 0.0003774161394065974,
        "amount": 1,
        "funds": {"type": "b"}
      }], "funds.type")

      // TDD GLBA-526
      expect(sumShares(formatted)).not.toBe(100)
      expect(formatted).not.toStrictEqual([{
        "share": 0.9997,
        "amount": 1,
        "funds": {"type": "a"},
      }, {
        "share": 0.0003,
        "amount": 1,
        "funds": {"type": "b"},
      }]) 
      expect(formatted).toStrictEqual([{
        "share": 0.9996,
        "amount": 1,
        "funds": {"type": "a"},
      }, {
        "share": 0.0003,
        "amount": 1,
        "funds": {"type": "b"},
      }])
    })

    it("1JfjM2GMnYhebgVr8hrd4Un7Nv6EdneTHF", () => {
      const formatted = formatter(
        require("./tests/1JfjM2GMnYhebgVr8hrd4Un7Nv6EdneTHF.sources.json")
        .map(a => ({
          ...a,
          "amount": 1
        })),
        "funds.type"
      )
      // TDD GLBA-526
      expect(sumShares(formatted)).not.toBe(100)
      expect(formatted).not.toMatchObject([{
        "share": 0.99,
        "funds": {"type": "exchange"},
      }, {
        "share": 0.01,
        "funds": {"type": "Small Transactions"},
      }])

      expect(formatted).toMatchObject([{
        "share": 0.9899,
        "funds": {"type": "exchange"},
      }, {
        "share": 0.01,
        "funds": {"type": "Small Transactions"},
      }])
    })

    it("1MTGf4jwvE8UgUYewMKvacjXSHmKrZWYQN", () => {
      const formatted = formatter(
        require("./tests/1MTGf4jwvE8UgUYewMKvacjXSHmKrZWYQN.sources.json")
        .map(a => ({
          ...a,
          "amount": 1
        })),
        "funds.type"
      )
      // TDD GLBA-526
      expect(sumShares(formatted)).not.toBe(100)
      expect(formatted).not.toMatchObject([{
        "share": 0.9999,
        "funds": {"type": "suspended exchange"},
      }, {
        "share": 0.0001,
        "funds": {"type": "Small Transactions"},
      }])


      expect(formatted).toMatchObject([{
        "share": 0.9998,
        "funds": {"type": "suspended exchange"},
      }, {
        "share": 0.0001,
        "funds": {"type": "Small Transactions"},
      }])
    })

    it("1RcKCqrWhZ7DkEZ2EiRFaY9spriwwimQw", () => {
      const formatted = formatter(
        require("./tests/1RcKCqrWhZ7DkEZ2EiRFaY9spriwwimQw.sources.json")
        .map(a => ({
          ...a,
          "amount": 1
        })),
        "funds.type"
      )
      // TDD GLBA-526
      expect(sumShares(formatted)).not.toBe(100)
      expect(formatted).not.toMatchObject([{
        "share": 99.97,
        "funds": {"type": "exchange"},
      }, {
        "share": 0.03,
        "funds": {"type": "Small Transactions"},
      }])
      expect(formatted).toMatchObject([{
        "share": 0.999600,
        "funds": {"type": "exchange"},
      }, {
        "share": 0.0003,
        "funds": {"type": "Small Transactions"},
      }])
    })
  })
})

describe(formatShare.name, () => {
  it("big", () => expect(formatShare(
    1
  )).toBe("100.00%"))

  it("almost", () => expect(formatShare(
    0.000099999999999999999
  )).toBe("0.01%"))

  it("small", () => expect(formatShare(
    0.00009999999999999999
  )).toBe("< 0.01%"))

})
describe('urlEncode tests', function(){
    var $urlEncode;
    beforeEach(function(){
        module('urlEncodingService');

        // The injector unwraps the underscores (_) from around the parameter names when matching
        inject(function(_$urlEncode_){
            $urlEncode = _$urlEncode_;
        });
    });

    it('should be able to encode an object containing a cstoken into a query string', function() {
        var csToken = "PoVmJOPl0LFs/5MWmemDfPs2K2PNak4OOeV7S+8SQ=Vy2o";
        var expectedString = "cstoken=PoVmJOPl0LFs%2F5MWmemDfPs2K2PNak4OOeV7S%2B8SQ%3DVy2o";

        var params = {
            cstoken: csToken
        };

        var encodedObject = $urlEncode(params);

        expect(encodedObject).toEqual(expectedString);
    });

    it('should be able to encode an object containing a cstoken and status into a query string', function() {
        var csToken = "PoVmJOPl0LFs/5MWmemDfPs2K2PNak4OOeV7S+8SQ=Vy2o";
        var frenchStatus = "à la française";
        var expectedString = "cstoken=PoVmJOPl0LFs%2F5MWmemDfPs2K2PNak4OOeV7S%2B8SQ%3DVy2o&status=%C3%A0%20la%20fran%C3%A7aise";

        var params = {
            cstoken: csToken,
            status: frenchStatus
        };

        var encodedObject = $urlEncode(params);

        expect(encodedObject).toEqual(expectedString);
    });

    it('should be able to encode an object containing a cstoken and an object literal into a query string', function() {
        var csToken = "PoVmJOPl0LFs/5MWmemDfPs2K2PNak4OOeV7S+8SQ=Vy2o";
        var expectedString = "cstoken=PoVmJOPl0LFs%2F5MWmemDfPs2K2PNak4OOeV7S%2B8SQ%3DVy2o&before%5BContentServer%5D=367";

        var params = {
            cstoken: csToken,
            before: {
                ContentServer: 367
            }
        };

        var encodedObject = $urlEncode(params);

        expect(encodedObject).toEqual(expectedString);
    });

    it('should be able to encode an object containing a cstoken and an object literal with a list into a query string', function() {
        var csToken = "PoVmJOPl0LFs/5MWmemDfPs2K2PNak4OOeV7S+8SQ=Vy2o";
        var expectedString = "cstoken=PoVmJOPl0LFs%2F5MWmemDfPs2K2PNak4OOeV7S%2B8SQ%3DVy2o&before%5BContentServer%5D=367&before%5BSomeArray%5D%5B0%5D=1&before%5BSomeArray%5D%5B1%5D=2&before%5BSomeArray%5D%5B2%5D=3&before%5BSomeArray%5D%5B3%5D=4&before%5BSomeArray%5D%5B4%5D=5";

        var params = {
            cstoken: csToken,
            before: {
                ContentServer: 367,
                SomeArray: [1,2,3,4,5]
            }
        };

        var encodedObject = $urlEncode(params);

        expect(encodedObject).toEqual(expectedString);
    });

    it('should be able to encode an object containing a many nests object literals into a query string', function() {
        var csToken = "PoVmJOPl0LFs/5MWmemDfPs2K2PNak4OOeV7S+8SQ=Vy2o";
        var expectedString = "cstoken=PoVmJOPl0LFs%2F5MWmemDfPs2K2PNak4OOeV7S%2B8SQ%3DVy2o&before%5BContentServer%5D=367&before%5BSomeArray%5D%5B0%5D=1&before%5BSomeArray%5D%5B1%5D=2&before%5BSomeArray%5D%5B2%5D=3&before%5BSomeArray%5D%5B3%5D=4&before%5BSomeArray%5D%5B4%5D=5&before%5Bnested%5D%5Bvalue1%5D=1&before%5Bnested%5D%5Bvalue2%5D=2&after%5BContentServer%5D=368";

        var params = {
            cstoken: csToken,
            before: {
                ContentServer: 367,
                SomeArray: [1,2,3,4,5],
                nested: {
                    value1: 1,
                    value2: 2
                }
            },
            after:{
                ContentServer: 368
            }
        };

        var encodedObject = $urlEncode(params);

        expect(encodedObject).toEqual(expectedString);
    });

    it('should be able to encode an array value from an object for the url string', function() {
        var csToken = "PoVmJOPl0LFs/5MWmemDfPs2K2PNak4OOeV7S+8SQ=Vy2o";
        var expectedString = "test%5B0%5D=1&test%5B1%5D=2&test%5B2%5D=3&test%5B3%5D=4&test%5B4%5D=5&test%5B5%5D=6";

        var params = {
            test: [1, 2, 3, 4, 5, 6]
        };

        var encodedObject = $urlEncode(params);

        expect(encodedObject).toEqual(expectedString);
    });

    it('should be able to encode an object that contains JSON to a url string', function() {
        var csToken = "PoVmJOPl0LFs/5MWmemDfPs2K2PNak4OOeV7S+8SQ=Vy2o";
        var expectedString = "cstoken=PoVmJOPl0LFs%2F5MWmemDfPs2K2PNak4OOeV7S%2B8SQ%3DVy2o&before=%7B%22ContentServer%22%3A367%7D";

        var params = {
            cstoken: csToken,
            before: JSON.stringify({
                ContentServer: 367
            })
        };

        var encodedObject = $urlEncode(params);

        expect(encodedObject).toEqual(expectedString);
    });
});

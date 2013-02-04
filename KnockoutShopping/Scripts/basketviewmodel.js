var BasketItem = (function () {
    
    function BasketItem() {
        this.id = 0;
        this.quantity = ko.observable();
        this.title = "";
    }

    return BasketItem;
})();


function BasketViewModel() {
    var data = [
        {
            'id': 1,
            'title': 'The Door',
            'artist': 'Religious Knives',
            'image': 'http://ecx.images-amazon.com/images/I/51og8BkN8jL._SS250_.jpg',
            'large_image': 'http://ecx.images-amazon.com/images/I/51og8BkN8jL._SS500_.jpg',
            'price': 9.98,
            'url': 'http://www.amazon.com/Door-Religious-Knives/dp/B001FGW0UQ/?tag=quirkey-20'
        },
        {
            'id': 2,
            'title': 'Album',
            'artist': 'Girls',
            'image': 'http://ecx.images-amazon.com/images/I/51hDxOeIeML._SS250_.jpg',
            'large_image': 'http://ecx.images-amazon.com/images/I/51hDxOeIeML._SS500_.jpg',
            'price': 13.98,
            'url': 'http://www.amazon.com/gp/product/B002GNOMJE?ie=UTF8&tag=quirkeycom-20&linkCode=as2&camp=1789&creative=390957&creativeASIN=B002GNOMJE'
        },
        {
            'id': 3,
            'title': 'Bitte Orca',
            'artist': 'The Dirty Projectors',
            'image': 'http://z2-ec2.images-amazon.com/images/P/B0026T4RTI.01._SS250_.jpg',
            'large_image': 'http://z2-ec2.images-amazon.com/images/P/B0026T4RTI.01._SS500_.jpg',
            'price': 13.98,
            'url': 'http://www.amazon.com/Bitte-Orca-Dirty-Projectors/dp/B0026T4RTI/ref=pd_sim_m_12?tag=quirkey-20'
        },
        {
            'id': 4,
            'title': 'The Pains of Being Pure at Heart',
            'artist': 'The Pains of Being Pure at Heart',
            'image': 'http://z2-ec2.images-amazon.com/images/P/B001LGXIDS.01._SS250_.jpg',
            'large_image': 'http://z2-ec2.images-amazon.com/images/P/B001LGXIDS.01._SS500_.jpg',
            'price': 13.99,
            'url': 'http://www.amazon.com/Pains-Being-Pure-Heart/dp/B001LGXIDS/ref=pd_sim_m_44?tag=quirkey-20'
        }
    ];

    var self = this;

    self.items = ko.observableArray();
    self.productID = ko.observable();
    self.chosenProduct = ko.observable();
    
    self.basketItems = ko.observableArray();

    self.basketItemCount = ko.computed(function () {
        var count = 0;
        var items = self.basketItems();
        for (var i = 0; i < items.length; i++) {
            count += items[i].quantity(); //Given that the quantity is an observable property
        }
        return count;
    });
    
    function loadItemsFromLocalStorage(){
        //Load items from local storage here, though local storage handling could preferably be moved to somewhere else
        var basket = JSON.parse((localStorage.getItem('shoppingBasket') || '[]'));
        
        basket.forEach(function (element, index, array) {
            var basketItem = new BasketItem();
            basketItem.id = element.id;
            basketItem.title = element.title;
            basketItem.quantity(element.quantity);
            self.basketItems.push(basketItem);
        });
    }
    
    loadItemsFromLocalStorage();
    
    var basketAsJson = ko.computed(function () {
        return ko.toJSON(self.basketItems());
    });

    basketAsJson.subscribe(function (json) {
        localStorage.setItem('shoppingBasket', json);
    });
    
   
    self.addItem = function (item) {
        
        var itemStoredAlready = self.basketItems().filter(function (x) { return x.id === item.id; }).length === 1;
        
        var basketItem = new BasketItem();

        if (itemStoredAlready) {
            
            basketItem = self.basketItems().filter(function (x) { return x.id === item.id; })[0];
            basketItem.quantity(basketItem.quantity() + parseInt(item.quantity, 10));
        } else {
            basketItem.id = item.id;
            basketItem.title = item.title;
            basketItem.quantity(parseInt(item.quantity, 10));
            self.basketItems.push(basketItem);
        }
        
        $('.cart-info')
            .animate({ paddingTop: '30px' })
            .animate({ paddingTop: '10px' });
    };

    var app = Sammy(function () {
        this.get('#/:id', function (context) {
            self.items(null);
            var product = data.filter(function (x) {
                return x.id === parseInt(context.params.id, 10);
            })[0];
            product.quantity = 12;
            self.chosenProduct(product);
        });

        this.get('/', function () {
            self.items(data);
            self.chosenProduct(null);
        });
    });

    jQuery(function () {
        console.log('rn');
        app.run();
    });
};

ko.applyBindings(new BasketViewModel());






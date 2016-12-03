$(document).ready(function() {
  var $getProducts = $('#get-products');
  var $productForm = $('#add-product-form');
  // Grab data from page
  var $productName = $('#product-name');
  var $productBasePrice = $('#product-base-price');
  var $productDescription = $('#product-description');
  var $productColor= $('#product-color');
  var $productWeight = $('#product-weight');
  var $productQuantity = $('#product-quantity');
  var $products = $('#products');
  var BASEURL = 'http://devpoint-ajax-example-server.herokuapp.com/api/v1'

  function loadProducts() {
    $products.empty();

    $.ajax({
      type: 'GET',
      url: BASEURL + '/products',
      dataType: 'JSON'
    }).success(function(data) {
      for (var i = 0; i < data.length; i++) {
        var product = data[i];
        // $products.append('<div id=' + product.id + '>' + '<div class="col s4">' + product.name + " " + product.base_price + '</div>  <button class="blue btn show-product"><i class="material-icons">visibility</i></button> <button class="orange btn edit-product"><i class="material-icons">edit</i></button> <button class="red btn delete-product"><i class="material-icons">delete</i></button> </div>');
        $products.append(
          "<div class='row'>" +
            "<div id='" + product.id + "'class='col s12 m6'>" +
              "<div class='card grey darken-4'>" +
                "<div class='card-content white-text'>" +
                  "<span class='card-title'>" + product.name + "</span>" +
                  "<p>" + "Description: " + product.description + "</p>" +
                  "<p>" + "Price: " + "$" + product.base_price + "</p>" +
                  "<button class='blue btn show-product'>" + "<i class='material-icons'>" + "visibility" + "</i>" + "</button>" +
                  "<button class='orange btn edit-product'>" + "<i class='material-icons'>" + "edit" + "</i>" + "</button>" +
                  "<button class='red btn delete-product'>" + "<i class='material-icons'>" + "delete" + "</i>" + "</button>" +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>"
        );
      }
    }).fail(function(data) {
      console.log(data);
    });
  }

  //--------------------EDIT BUTTON----------------//
  $(document).on('click', '.edit-product', function() {
    // debugger;
  	var productId = $(this).parent().parent().parent().attr('id');
  	$.ajax({
  		type: 'GET',
  		url: BASEURL + '/products/' + productId,
  		dataType: 'JSON'
  	}).success(function(data) {
  		$productName.val(data.name).focus();
  		$productBasePrice.val(data.base_price);
  		$productDescription.val(data.description);
      $productColor.val(data.color);
      $productWeight.val(data.weight);
      $productQuantity.val(data.quantity_on_hand);

  		$productForm.attr('data-product-id', productId);

  	}).fail(function(data) {
  		console.log(data);
  	});
  });

  //-----------------DELETE BUTTON------------------//
  $(document).on('click', '.delete-product', function() {
    var productId = $(this).parent().parent().parent().attr('id');
    $.ajax({
      type: 'DELETE',
      url: BASEURL + '/products/' + productId,
      dataType: 'JSON'
    }).success(function(data) {
      $('#' + productId).remove();
    }).fail(function(data) {
      console.log(data);
    });
  });

  // ----------------SHOW BUTTON------------------//
  $(document).on('click', '.show-product', function() {
    var productId = $(this).parent().parent().parent().attr('id');
    $.ajax({
      type:'GET',
      url: BASEURL + '/products/' + productId,
      dataType: 'JSON',
    }).success(function(data) {
      console.log('show')
      var product = data
      // $users.append("<div col s12 class='btn black'>" + user.first_name + " " + user.last_name + " " + user.phone_number + "</div>")
      $products.append(
        "<div class='row'>" +
          "<div class='col s12 m6'>" +
            "<div class='card orange accent-3'>" +
              "<div class='card-content black-text'>" +
                "<span class='card-title'>" + "Product: " + product.name + "</span>" +
                "<p>" + "Price: " + "$" + product.base_price + "</p>" +
                "<p>" + "Description: " + product.description + "</p>" +
                "<p>" + "Color: " + product.color + "</p>" +
                "<p>" + "Weight: " + product.weight + "</p>" +
                "<p>" + "Quantity: " + product.quantity_on_hand + "</p>" +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      )
    }).fail(function(data) {
      console.log(data);
    });
  });

$productForm.submit(function(e) {
    e.preventDefault();
    var requestType, requestUrl


    if($(this).data('product-id')) {
      requestType = 'PUT';
      requestUrl = BASEURL + '/products/' + $(this).data('product-id');
    } else {
      requestType = 'POST';
      requestUrl = BASEURL + '/products';
    }
    $.ajax({
      type: requestType,
      url: requestUrl,
      dataType: 'JSON',
      data: {product: {name: $productName.val(),
                      base_price: $productBasePrice.val(),
                      color: $productColor.val(),
                      weight: $productWeight.val(),
                      description: $productDescription.val(),
                      quantity_on_hand: $productQuantity.val()
                      }}
    }).success(function(data) {
      $productForm[0].reset();
      $productName.focus();
      loadProducts();
    }).fail(function(data) {
      console.log(data);
    });
  });

  $getProducts.click(function() {
    loadProducts();
  });

});
